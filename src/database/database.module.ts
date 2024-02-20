import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Appointment } from './entities/appointment.entity'
import { Authcode } from './entities/authcode.entity'
import { DoctorSchedule } from './entities/doctor-schedule.entity'
import { Doctor } from './entities/doctor.entity'
import { Patient } from './entities/patient.entity'
import { User } from './entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<envConfig>) => ({
        type: 'postgres',
        host: configService.getOrThrow('TYPEORM_HOST'),
        port: configService.getOrThrow('TYPEORM_PORT'),
        database: configService.getOrThrow('TYPEORM_DATABASE'),
        username: configService.getOrThrow('TYPEORM_USERNAME'),
        password: configService.getOrThrow('TYPEORM_PASSWORD'),
        logging: configService.getOrThrow('TYPEORM_LOGGING'),
        synchronize: configService.getOrThrow('TYPEORM_SYNCHRONIZE'),
        entities: [
          Appointment,
          Authcode,
          DoctorSchedule,
          Doctor,
          Patient,
          User,
        ],
        ssl: true,
      }),
      inject: [ConfigService<envConfig>],
    }),
  ],
})
export class DatabaseModule {}
