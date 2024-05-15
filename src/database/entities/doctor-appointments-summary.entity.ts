import { DataSource, ViewColumn, ViewEntity } from 'typeorm'
import { Doctor } from './doctor.entity'
import { Appointment } from './appointment.entity'

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder(Doctor, 'doctor')
      .select([
        'ROW_NUMBER() OVER(PARTITION BY 1)::integer as "summaryId"',
        'doctor.id as "doctorId"',
        'doctor."firstName" || \' \' || doctor."lastName" as "fullName"',
        'ARRAY_AGG(distinct departament."departamentId") as "departamentIds"',
        '(COUNT(*) / ARRAY_LENGTH(ARRAY_AGG(distinct departament."departamentId"),1))::integer as "appointmentCount"',
        'EXTRACT (week FROM appointment."startTime")::integer as "weekNumber"',
        'MIN(appointment."startTime") as "weekMinDate"',
      ])
      .innerJoin(
        'departament_doctors_doctor',
        'departament',
        'departament."doctorId" = doctor.id'
      )
      .innerJoin(
        Appointment,
        'appointment',
        'appointment."doctorId" = doctor.id'
      )
      .groupBy('doctor.id, "weekNumber"')
      .orderBy('"weekNumber"', 'ASC'),
})
export class DoctorAppointmentsSummary {
  @ViewColumn()
  summaryId: number

  @ViewColumn()
  doctorId: number

  @ViewColumn()
  fullName: string

  @ViewColumn()
  departamentIds: number[]

  @ViewColumn()
  appointmentCount: number

  @ViewColumn()
  weekNumber: number

  @ViewColumn()
  weekMinDate: Date
}
