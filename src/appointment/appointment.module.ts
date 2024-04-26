import { Module } from '@nestjs/common'
import { AppointmentService } from './appointment.service'
import { AppointmentController } from './appointment.controller'
import { DoctorModule } from 'src/doctor/doctor.module'
import { PatientModule } from 'src/patient/patient.module'
import { DoctorScheduleModule } from 'src/doctor-schedule/doctor-schedule.module'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule, DoctorModule, PatientModule, DoctorScheduleModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
