export interface AppConfig {
  port: number
  bcryptSalt: string
  jwtSecret: string
  typeorm: {
    host: string
    database: string
    port: number
    username: string
    password: string
    logging: boolean
  }
  nodemail: {
    host: string
    port: number
    auth: {
      user: string
      pass: string
    }
  }
  twilio: {
    accountSid: string
    authToken: string
    serviceSid: string
  }
}
