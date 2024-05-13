import { Appointment } from 'src/database/entities/appointment.entity'
import { Departament } from 'src/database/entities/departament.entity'
import { Doctor } from 'src/database/entities/doctor.entity'
import { WrapDepartament } from 'src/departament/util'

export function deleteDates(departament: Departament) {
  const updatedDepartament = { ...departament }

  delete updatedDepartament.createdAt
  delete updatedDepartament.updatedAt

  updatedDepartament.doctors = updatedDepartament?.doctors.map((doctor) =>
    deletingDatesFromDoctors(doctor)
  )

  updatedDepartament.children = updatedDepartament.children.map((departament) =>
    deleteDates(departament)
  )

  return updatedDepartament
}

function deletingDatesFromDoctors(doctor: Doctor) {
  const updatedDoctor = { ...doctor }

  delete updatedDoctor.createdAt
  delete updatedDoctor.updatedAt

  updatedDoctor.appointments = updatedDoctor.appointments.map((appointment) =>
    deletingDatesFromAppointments(appointment)
  )

  return updatedDoctor
}

function deletingDatesFromAppointments(appointment: Appointment) {
  const updatedAppointment = { ...appointment }

  delete updatedAppointment.createdAt
  delete updatedAppointment.updatedAt

  return updatedAppointment
}

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
    lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
    offsetDate = date.getDate() + firstWeekday - 1,
    index = 1, // start index at 0 or 1, your choice
    weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7),
    week = index + Math.floor(offsetDate / 7)
  if (week < 2 + index) return week
  return week === weeksInMonth ? index + 5 : week
}

function weekCount(year, month_number) {
  // month_number is in the range 1..12

  var firstOfMonth = new Date(year, month_number - 1, 1)
  var lastOfMonth = new Date(year, month_number, 0)

  var used = firstOfMonth.getDay() + lastOfMonth.getDate()

  return Math.ceil(used / 7)
}

export function getMonthWeekFirstDay(year, month, week) {
  // Set date to 1th of month
  let d = new Date(year, month - 1, 1)

  if (week == 1) {
    return d
  }

  // Get day number, set Sunday to 7
  let day = d.getDay() || 7
  // Set to prior Monday
  d.setDate(d.getDate() - day + 1)
  // Set to required week
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

export function wrapDepartaments(roots: Departament[], week: Week) {
  const wrapDepartament = (departament: Departament) => {
    const haveChildren = departament.children.length !== 0
    const haveDoctors = departament.doctors.length !== 0

    if (haveChildren) {
      let wrapedChildren = departament.children.map((child) =>
        wrapDepartament(child)
      )

      const childrenEmpty = wrapedChildren.every((child) => child == null)

      if (!childrenEmpty) {
        return { [departament.name]: Object.assign({}, ...wrapedChildren) }
      }
    }

    if (!haveDoctors) {
      return null
    }

    // have doctors and children empty

    return {
      [departament.name]: departament.doctors.map((doctor) => ({
        doctorId: doctor.id,
        fullName: `${doctor.firstName} ${doctor.lastName}`,
        departamentIds: getDepartamentIds(doctor, roots),
        appointmentCount: getAppoitmentCountByWeek(doctor.appointments, week),
      })),
    }
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
