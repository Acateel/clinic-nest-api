import { AppConfig } from './app-config'

export const appConfigFactory = (): AppConfig => ({
  port: parseInt(process.env.PORT!),
  bcryptSalt: process.env.BCRYPT_SALT!,
  jwtSecret: process.env.JWT_SECRET!,
  typeorm: {
    host: process.env.TYPEORM_HOST!,
    database: process.env.TYPEORM_DATABASE!,
    port: parseInt(process.env.TYPEORM_PORT!),
    username: process.env.TYPEORM_USERNAME!,
    password: process.env.TYPEORM_PASSWORD!,
    logging: Boolean(process.env.TYPEORM_LOGGING!),
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
