import { Module } from '@nestjs/common'
import { AnalyticService } from './analytic.service'
import { AnalyticController } from './analytic.controller'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [AnalyticService],
  controllers: [AnalyticController],
})
export class AnalyticModule {}
