import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { ConfigModule } from '@nestjs/config'
import { DoctorModule } from './doctor/doctor.module'
import { PatientModule } from './patient/patient.module'
import { UserModule } from './user/user.module'
import { DoctorScheduleModule } from './doctor-schedule/doctor-schedule.module'
import { AppointmentModule } from './appointment/appointment.module'
import { AuthcodeModule } from './authcode/authcode.module'
import { AuthModule } from './auth/auth.module'
import { EmailSenderModule } from './email-sender/email-sender.module'
import { SmsSenderModule } from './sms-sender/sms-sender.module'
import { appConfigFactory } from './common/app-config-factory'
import { ThrottlerModule } from '@nestjs/throttler'
import { DepartamentModule } from './departament/departament.module';
import { AnalyticModule } from './analytic/analytic.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfigFactory] }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    DatabaseModule,
    DoctorModule,
    PatientModule,
    UserModule,
    DoctorScheduleModule,
    AppointmentModule,
    AuthcodeModule,
    AuthModule,
    EmailSenderModule,
    SmsSenderModule,
    DepartamentModule,
    AnalyticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
