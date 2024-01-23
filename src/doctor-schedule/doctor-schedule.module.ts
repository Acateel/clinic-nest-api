import { Module } from '@nestjs/common'
import { DoctorScheduleService } from './doctor-schedule.service'
import { DoctorScheduleController } from './doctor-schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DoctorSchedule } from './entities/doctor-schedule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DoctorSchedule])],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
