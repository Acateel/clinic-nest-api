import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import { DoctorModule } from './doctor/doctor.module'
import { PatientModule } from './patient/patient.module'
import { UserModule } from './user/user.module'
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module'
import { AppointmentModule } from './appointment/appointment.module'
import { AuthcodeModule } from './authcode/authcode.module'
import { AuthModule } from './auth/auth.module';
import { EmailSenderModule } from './email-sender/email-sender.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DoctorModule,
    PatientModule,
    UserModule,
    DoctorScheduleModule,
    AppointmentModule,
    AuthcodeModule,
    AuthModule,
    EmailSenderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
