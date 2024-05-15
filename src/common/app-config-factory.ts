import { Appointment } from 'src/database/entities/appointment.entity'
import { AppConfig } from './app-config'
import { Authcode } from 'src/database/entities/authcode.entity'
import { DoctorSchedule } from 'src/database/entities/doctor-schedule.entity'
import { Doctor } from 'src/database/entities/doctor.entity'
import { Patient } from 'src/database/entities/patient.entity'
import { User } from 'src/database/entities/user.entity'
import { Departament } from 'src/database/entities/departament.entity'
import { DoctorAppointmentsSummary } from 'src/database/entities/doctor-appointments-summary.entity'

export const appConfigFactory = (): AppConfig => ({
  port: parseInt(process.env.PORT!),
  bcryptSalt: process.env.BCRYPT_SALT!,
  jwtSecret: process.env.JWT_SECRET!,
  database: {
    type: 'postgres',
    host: process.env.TYPEORM_HOST!,
    port: parseInt(process.env.TYPEORM_PORT!),
    database: process.env.TYPEORM_DATABASE!,
    username: process.env.TYPEORM_USERNAME!,
    password: process.env.TYPEORM_PASSWORD!,
    logging: process.env.TYPEORM_LOGGING! === 'true',
    synchronize: false,
    entities: [
      Appointment,
      Authcode,
      DoctorSchedule,
      Doctor,
      Patient,
      User,
      Departament,
      DoctorAppointmentsSummary,
    ],
    ssl: true,
  },
  nodemail: {
    host: process.env.NODEMAILER_HOST!,
    port: parseInt(process.env.NODEMAILER_PORT)!,
    auth: {
      user: process.env.NODEMAILER_USER!,
      pass: process.env.NODEMAILER_PASS!,
    },
    templatePath: process.env.NODEMAILER_TEMPLATE_PATH!,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    serviceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
  },
})
