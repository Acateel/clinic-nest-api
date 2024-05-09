import { Controller, Get } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('doctor-appointments-summary')
  doctorAppointmentsSummary() {
    return this.analyticsService.comptuteAppointmentsAnalytics()
  }
}
