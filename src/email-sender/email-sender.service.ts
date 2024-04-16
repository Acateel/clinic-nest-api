import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transporter, createTransport } from 'nodemailer'
import { transformHTMLTemplate } from './util'
import { envConfig } from 'src/common/env-config'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

@Injectable()
export class EmailSenderService {
  private transport: Transporter<SMTPTransport.SentMessageInfo>

  constructor(private configService: ConfigService<envConfig>) {
    this.transport = createTransport({
      host: this.configService.getOrThrow('NODEMAILER_HOST'),
      port: +this.configService.getOrThrow('NODEMAILER_PORT'),
      auth: {
        user: this.configService.getOrThrow('NODEMAILER_USER'),
        pass: this.configService.getOrThrow('NODEMAILER_PASS'),
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
