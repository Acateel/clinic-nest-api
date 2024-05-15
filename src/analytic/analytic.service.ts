import { Injectable } from '@nestjs/common'
import { InjectDataSource, InjectEntityManager } from '@nestjs/typeorm'
import { DataSource, EntityManager } from 'typeorm'
import { DoctorAppointmentsSummary } from 'src/database/entities/doctor-appointments-summary.entity'

@Injectable()
export class AnalyticService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    @InjectDataSource()
    private dataSourse: DataSource
  ) {}

  async comptuteAppointmentsAnalytics(
    isIncludeEmptyValues: boolean,
    fromDate: string,
    toDate: string,
    filterDepartamentIds: string
  ) {
    const summary = await this.entityManager.find(DoctorAppointmentsSummary)

    return summary
  }
}
