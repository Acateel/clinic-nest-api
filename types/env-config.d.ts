interface envConfig {
  PORT: number

  TYPEORM_HOST: string
  TYPEORM_USERNAME: string
  TYPEORM_PASSWORD: string
  TYPEORM_PORT: number
  TYPEORM_LOGGING: boolean
  TYPEORM_DATABASE: string
  TYPEORM_SYNCHRONIZE: boolean

  BCRYPT_SALT: string
  JWT_SECRET: string

  NODEMAILER_HOST: string
  NODEMAILER_PORT: number
  NODEMAILER_USER: string
  NODEMAILER_PASS: string

  TWILIO_ACCOUNT_SID: string
  TWILIO_AUTH_TOKEN: string
  TWILIO_MESSAGING_SERVICE_SID: string
}
