import { Module } from '@nestjs/common'
import { AnalyticService } from './analytic.service'
import { AnalyticController } from './analytic.controller'
import { DatabaseModule } from 'src/database/database.module'
import { AnalyticsRepository } from './analytics.repository'

@Module({
  imports: [DatabaseModule],
  providers: [AnalyticService, AnalyticsRepository],
  controllers: [AnalyticController],
})
export class AnalyticModule {}
