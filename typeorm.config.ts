import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { DataSource } from 'typeorm'

config()

const configService = new ConfigService()

const path = './src/database/entities'

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('TYPEORM_HOST'),
  port: configService.getOrThrow('TYPEORM_PORT'),
  database: configService.getOrThrow('TYPEORM_DATABASE'),
  username: configService.getOrThrow('TYPEORM_USERNAME'),
  password: configService.getOrThrow('TYPEORM_PASSWORD'),
  logging: configService.getOrThrow('TYPEORM_LOGGING'),
  synchronize: configService.getOrThrow('TYPEORM_SYNCHRONIZE'),
  migrations: ['migrations/**'],
  entities: [
    `${path}/appointment.entity`,
    `${path}/authcode.entity`,
    `${path}/doctor-schedule.entity`,
    `${path}/doctor.entity`,
    `${path}/patient.entity`,
    `${path}/user.entity`,
  ],
  ssl: true,
})
