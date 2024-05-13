import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('doctor-appointments-summary')
  doctorAppointmentsSummary(
    @Query('isIncludeEmptyValues') isIncludeEmptyValues: boolean,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('filterDepartamentIds') filterDepartamentIds: string
  ) {
    return this.analyticsService.comptuteAppointmentsAnalytics(
      isIncludeEmptyValues,
      { startTime: new Date(fromDate), endTime: new Date(toDate) },
      filterDepartamentIds ? JSON.parse(filterDepartamentIds) : []
    )
  }
}
