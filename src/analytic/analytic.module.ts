import { Module } from '@nestjs/common'
import { AnalyticService } from './analytic.service'
import { AnalyticController } from './analytic.controller'
import { DatabaseModule } from 'src/database/database.module'
import { DoctorAppointmentsSummaryRepository } from './repository/doctor-appointments-summary.repository'

@Module({
  imports: [DatabaseModule],
  providers: [AnalyticService, DoctorAppointmentsSummaryRepository],
  controllers: [AnalyticController],
})
export class AnalyticModule {}
