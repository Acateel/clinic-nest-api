import { Injectable } from '@nestjs/common'

@Injectable()
export class AnalyticsService {
  comptuteAppointmentsAnalytics() {
    return 'Doctor appoitments summery'
  }
}
