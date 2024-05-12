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

export function getWeeksArray(dates: TimePeriod) {
  let weeks = []

  return weeks
}

export function wrapDepartaments(roots: Departament[]) {
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
        summaryId: departament.id, // ???
        doctorId: doctor.id,
        fullName: `${doctor.firstName} ${doctor.lastName}`,
        departamentIds: getDepartamentIds(doctor, roots),
        appointmentCount: doctor.appointments.length,
        weeksNumber: 0, // find later
        weekMinDate: 'Date', // find by appointments
      })),
    }
  }

  const result = roots.map((departament) => wrapDepartament(departament))
  return Object.assign({}, ...result)
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
