import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from './entities/appointment.entity'
import { Authcode } from './entities/authcode.entity'
import { DoctorSchedule } from './entities/doctor-schedule.entity'
import { Doctor } from './entities/doctor.entity'
import { Patient } from './entities/patient.entity'
import { User } from './entities/user.entity'
import { AppConfig } from 'src/common/app-config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig>) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Appointment,
      Authcode,
      DoctorSchedule,
      Doctor,
      Patient,
      User,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
