import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { Appointment } from './src/database/entities/appointment.entity'
import { Authcode } from './src/database/entities/authcode.entity'
import { DoctorSchedule } from './src/database/entities/doctor-schedule.entity'
import { Doctor } from './src/database/entities/doctor.entity'
import { Patient } from './src/database/entities/patient.entity'
import { User } from './src/database/entities/user.entity'
import { envConfig } from './src/common/env-config'

config()

const configService = new ConfigService<envConfig>()

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('TYPEORM_HOST'),
  port: configService.getOrThrow('TYPEORM_PORT'),
  database: configService.getOrThrow('TYPEORM_DATABASE'),
  username: configService.getOrThrow('TYPEORM_USERNAME'),
  password: configService.getOrThrow('TYPEORM_PASSWORD'),
  logging: configService.getOrThrow('TYPEORM_LOGGING'),
  synchronize: false,
  migrations: ['migrations/**'],
  entities: [Appointment, Authcode, DoctorSchedule, Doctor, Patient, User],
  ssl: true,
})
