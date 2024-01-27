import { createTransport } from 'nodemailer'
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config'

dotenv.config()

const configService = new ConfigService()

const transport = createTransport({
  host: configService.getOrThrow('NODEMAILER_HOST'),
  port: +configService.getOrThrow('NODEMAILER_PORT'),
  auth: {
    user: configService.getOrThrow('NODEMAILER_USER'),
    pass: configService.getOrThrow('NODEMAILER_PASS'),
  },
})

export async function sendAuthCodeByEmail(emailTo: string, code: string) {
  const info = await transport.sendMail({
    from: 'Clinic node api',
    to: emailTo,
    subject: 'Authorization by sended code',
    html: `<p>Sended code: <b>${code}</b> </p>`,
  })
}
