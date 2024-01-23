import { Module, forwardRef } from '@nestjs/common'
import { DoctorScheduleService } from './doctor-schedule.service'
import { DoctorScheduleController } from './doctor-schedule.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DoctorSchedule } from './entities/doctor-schedule.entity'
import { DoctorModule } from 'src/doctor/doctor.module'
import { AppointmentModule } from 'src/appointment/appointment.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([DoctorSchedule]),
    DoctorModule,
    forwardRef(() => AppointmentModule),
  ],
  controllers: [DoctorScheduleController],
  providers: [DoctorScheduleService],
  exports: [DoctorScheduleService],
})
export class DoctorScheduleModule {}
