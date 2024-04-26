import { Appointment } from 'src/database/entities/appointment.entity'
import { Authcode } from 'src/database/entities/authcode.entity'
import { DoctorSchedule } from 'src/database/entities/doctor-schedule.entity'
import { Doctor } from 'src/database/entities/doctor.entity'
import { Patient } from 'src/database/entities/patient.entity'
import { User } from 'src/database/entities/user.entity'

export interface AppConfig {
  port: number
  bcryptSalt: string
  jwtSecret: string
  database: {
    type: string
    host: string
    port: number
    database: string
    username: string
    password: string
    logging: boolean
    synchronize: boolean
    entities: (
      | typeof Appointment
      | typeof Authcode
      | typeof DoctorSchedule
      | typeof Doctor
      | typeof Patient
      | typeof User
    )[]
    ssl: boolean
  }
  nodemail: {
    host: string
    port: number
    auth: {
      user: string
      pass: string
    }
    templatePath: string
  }
  twilio: {
    accountSid: string
    authToken: string
    serviceSid: string
  }
}
