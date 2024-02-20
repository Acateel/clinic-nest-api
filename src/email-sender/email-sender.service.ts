import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport } from 'nodemailer'
import { transformHTMLTemplate } from './util'

@Injectable()
export class EmailSenderService {
  private transport: any

  constructor(private configService: ConfigService<envConfig>) {
    this.transport = createTransport({
      host: configService.getOrThrow('NODEMAILER_HOST'),
      port: +configService.getOrThrow('NODEMAILER_PORT'),
      auth: {
        user: configService.getOrThrow('NODEMAILER_USER'),
        pass: configService.getOrThrow('NODEMAILER_PASS'),
      },
    })
  }

  async sendAuthCodeByEmail(emailTo: string, code: string) {
    const pathToTemplate = './templates/email-send-code.html'
    const emailHtml = transformHTMLTemplate(pathToTemplate, { code })

    await this.transport.sendMail({
      from: 'Clinic node api',
      to: emailTo,
      subject: 'Authorization by sended code',
      html: emailHtml,
    })
  }
}
