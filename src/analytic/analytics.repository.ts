import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { Doctor } from '../database/entities/doctor.entity'
import { Appointment } from '../database/entities/appointment.entity'
import { DoctorAppointmentsSummary } from './interfaces'

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource
  ) {}

  public find(): Promise<DoctorAppointmentsSummary[]> {
    return this.dataSource
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
      .orderBy('"weekNumber"', 'ASC')
      .getRawMany()
      .then((value) => value as DoctorAppointmentsSummary[])
  }
}
