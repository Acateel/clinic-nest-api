import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('doctor-appointments-summary')
  doctorAppointmentsSummary(
    @Query('isIncludeEmptyValues') isIncludeEmptyValues: boolean
  ) {
    return this.analyticsService.comptuteAppointmentsAnalytics(
      isIncludeEmptyValues
    )
  }
}
