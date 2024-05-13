import { Appointment } from 'src/database/entities/appointment.entity'
import { Departament } from 'src/database/entities/departament.entity'
import { Doctor } from 'src/database/entities/doctor.entity'

export interface TimePeriod {
  startTime: Date
  endTime: Date
}

export interface Week {
  year: number
  month: number
  weekNumber: number
}

export function findStartEndDate(departaments: Departament[]): TimePeriod {
  const dates: TimePeriod = { startTime: new Date(), endTime: new Date() }

  let initStartTime = false
  let initEndTime = false

  const findInDepart = (departament: Departament) => {
    departament?.children.forEach((departament) => {
      findInDepart(departament)
    })

    departament?.doctors.forEach((doctor) => {
      doctor?.appointments.forEach((appointment) => {
        if (appointment.startTime < dates.startTime || !initStartTime) {
          dates.startTime = appointment.startTime
          initStartTime = true
        }

        if (appointment.endTime > dates.endTime || !initEndTime) {
          dates.endTime = appointment.endTime
          initEndTime = true
        }
      })
    })
  }

  departaments.forEach((departament) => {
    findInDepart(departament)
  })

  return dates
}

export function getWeeksArray({ startTime, endTime }: TimePeriod): Week[] {
  let weeks: Week[] = []

  let initYear = startTime.getUTCFullYear()
  let initMonth = startTime.getUTCMonth()
  let initWeek = getWeekOfMonth(startTime)

  const endYear = endTime.getUTCFullYear()
  const endMonth = endTime.getUTCMonth()
  const endWeek = getWeekOfMonth(endTime)

  while (initYear <= endYear) {
    while (initMonth <= 12) {
      if (initMonth == endMonth && initYear == endYear) {
        while (initWeek <= endWeek) {
          weeks.push({
            year: initYear,
            month: initMonth + 1,
            weekNumber: initWeek,
          })
          initWeek++
        }
        return weeks
      }

      const countWeeks = weekCount(initYear, initMonth)
      while (initWeek <= countWeeks) {
        weeks.push({
          year: initYear,
          month: initMonth + 1,
          weekNumber: initWeek,
        })
        initWeek++
      }

      initMonth++
      initWeek = 1
    }

    initYear++
    initMonth = 1
  }

  return weeks
}

function getWeekOfMonth(date: Date) {
  var month = date.getMonth(),
    year = date.getFullYear(),
    firstWeekday = new Date(year, month, 1).getDay(),
    offsetDate = date.getDate() + firstWeekday - 1,
    week = Math.ceil(offsetDate / 7)

  return week
}

function weekCount(year, month_number) {
  // month_number is in the range 1..12

  var firstOfMonth = new Date(year, month_number - 1, 1)
  var lastOfMonth = new Date(year, month_number, 0)

  var used = firstOfMonth.getDay() + lastOfMonth.getDate() - 1

  return Math.ceil(used / 7)
}

export function getMonthWeekFirstDay(year, month, week) {
  let d = new Date(year, month - 1, 1)

  if (week == 1) {
    return d
  }

  let day = d.getDay() || 7
  d.setDate(d.getDate() - day + 1)
  d.setDate(d.getDate() + 7 * (week - 1))
  return d
}

export function getMonthWeekLastDay(date: Date) {
  let d = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  d.setDate(d.getDate() - d.getDay() + 7)

  return d
}

export function getTimePeriod(year, month, week): TimePeriod {
  const firstDay = getMonthWeekFirstDay(year, month, week)

  const lastDay = getMonthWeekLastDay(firstDay)

  if (lastDay.getMonth() != firstDay.getMonth()) {
    lastDay.setDate(0)
  }

  lastDay.setHours(23, 59, 59, 999)

  return {
    startTime: firstDay,
    endTime: lastDay,
  }
}

export function wrapDepartaments(
  roots: Departament[],
  week: Week,
  isIncludeEmptyValues: boolean,
  filterDepartamentIds: number[]
) {
  const wrapDepartament = (departament: Departament) => {
    if (
      filterDepartamentIds.length !== 0 &&
      filterDepartamentIds.every((id) => id !== departament.id)
    ) {
      return
    }

    if (departament.children.length !== 0) {
      let wrapedChildren = departament.children.map((child) =>
        wrapDepartament(child)
      )

      const childrenEmpty = wrapedChildren.every((child) => child == null)

      if (!childrenEmpty) {
        return { [departament.name]: Object.assign({}, ...wrapedChildren) }
      }
    }

    if (departament.doctors.length == 0) {
      if (isIncludeEmptyValues) {
        return { [departament.name]: [] }
      }
      return null
    }

    // have doctors and children empty

    let wrappedDoctors = []

    departament.doctors.forEach((doctor) => {
      const appointmentCount = getAppoitmentCountByWeek(
        doctor.appointments,
        week
      )

      if (appointmentCount == 0) {
        return
      }

      wrappedDoctors.push({
        doctorId: doctor.id,
        fullName: `${doctor.firstName} ${doctor.lastName}`,
        departamentIds: getDepartamentIds(doctor, roots),
        appointmentCount,
      })
    })

    if (wrappedDoctors.length == 0) {
      if (isIncludeEmptyValues) {
        return { [departament.name]: wrappedDoctors }
      }
      return null
    }

    return { [departament.name]: wrappedDoctors }
  }

  const result = roots.map((departament) => wrapDepartament(departament))
  return Object.assign({}, ...result)
}

function getAppoitmentCountByWeek(appointments: Appointment[], week: Week) {
  let count = 0
  const period = getTimePeriod(week.year, week.month, week.weekNumber)

  appointments.forEach((appointment) => {
    if (
      period.startTime <= appointment.startTime &&
      appointment.startTime <= period.endTime
    ) {
      count++
    }
  })

  return count
}

function getDepartamentIds(doctor: Doctor, roots: Departament[]) {
  let depIds = []

  const getDepIds = (root: Departament) => {
    root?.children.forEach((child) => getDepIds(child))

    root?.doctors.forEach((innerDoctor) => {
      if (innerDoctor.id == doctor.id) {
        depIds.push(root.id)
      }
    })
  }

  roots.forEach((root) => getDepIds(root))

  return depIds
}

export function findTopDoctor(
  departaments: Departament[],
  selectedPeriod: TimePeriod
) {
  const doctorsStatistic = []

  const findTopDoctorInner = (departament: Departament) => {
    departament.children.forEach((child) => {
      findTopDoctorInner(child)
    })

    if (departament.doctors.length !== 0) {
      departament.doctors.forEach((doctor) => {
        const isUniqueDoctor = doctorsStatistic.every(
          (stat) => stat.doctorId !== doctor.id
        )

        if (!isUniqueDoctor) {
          return
        }

        const doctorStat = {
          doctorId: doctor.id,
          appointmentCount: 0,
          allAppoitmentCount: doctor.appointments.length,
        }

        doctor.appointments.forEach((appointment) => {
          if (
            selectedPeriod.startTime <= appointment.startTime &&
            appointment.startTime <= selectedPeriod.endTime
          ) {
            doctorStat.appointmentCount++
          }
        })

        doctorsStatistic.push(doctorStat)
      })
    }
  }

  departaments.forEach((departament) => findTopDoctorInner(departament))

  let maxAppotmentCount = 0
  let topDoctor = null

  doctorsStatistic.forEach((element) => {
    if (element.appointmentCount > maxAppotmentCount) {
      topDoctor = element
      maxAppotmentCount = element.appointmentCount
    }
  })

  if (!topDoctor) {
    return {}
  }

  const prevPeriodCount =
    topDoctor.allAppoitmentCount - topDoctor.appointmentCount
  const productivitiGrowth = Math.round(
    100 - (prevPeriodCount / topDoctor.appointmentCount) * 100
  )

  return {
    doctorId: topDoctor.doctorId,
    appointmentCount: topDoctor.appointmentCount,
    productivitiGrowth: prevPeriodCount == 0 ? null : productivitiGrowth,
  }
}
