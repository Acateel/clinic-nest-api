import { Module } from '@nestjs/common'
import { AppointmentService } from './appointment.service'
import { AppointmentController } from './appointment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from '../database/entities/appointment.entity'
import { DoctorModule } from 'src/doctor/doctor.module'
import { PatientModule } from 'src/patient/patient.module'
import { DoctorScheduleModule } from 'src/doctor-schedule/doctor-schedule.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    DoctorModule,
    PatientModule,
    DoctorScheduleModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
