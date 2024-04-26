import { Module } from '@nestjs/common'
import { DoctorScheduleService } from './doctor-schedule.service'
import { DoctorScheduleController } from './doctor-schedule.controller'
import { DoctorModule } from 'src/doctor/doctor.module'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule, DoctorModule],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
  exports: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
