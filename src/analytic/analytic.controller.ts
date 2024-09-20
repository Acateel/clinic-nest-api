import { Controller, Get, Query } from '@nestjs/common'
import { AnalyticService } from './analytic.service'

@Controller('analytic')
export class AnalyticController {
  constructor(private analyticService: AnalyticService) {}

  @Get('doctor-appointments-summary')
  doctorAppointmentsSummary(
    @Query('isIncludeEmptyValues') isIncludeEmptyValues: boolean,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
    @Query('filterDepartamentIds') filterDepartamentIds: string
  ) {
    return this.analyticService.comptuteAppointmentsAnalytics(
      isIncludeEmptyValues,
      fromDate,
      toDate,
      filterDepartamentIds
    )
  }
}
