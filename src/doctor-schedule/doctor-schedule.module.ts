import { Module } from '@nestjs/common'
import { DoctorScheduleService } from './doctor-schedule.service'
import { DoctorScheduleController } from '../doctor/doctor-schedule.controller'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
  exports: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
