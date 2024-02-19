import { Module } from '@nestjs/common'
import { DoctorScheduleService } from './doctor-schedule.service'
import { DoctorScheduleController } from './doctor-schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DoctorSchedule } from '../database/entities/doctor-schedule.entity'
import { DoctorModule } from 'src/doctor/doctor.module'

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSchedule]), DoctorModule],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
  exports: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
