import { Inject, Injectable } from '@nestjs/common'
import { Transporter } from 'nodemailer'
import { transformHTMLTemplate } from './util'
import { SMTP_TRANSPORTER } from 'src/common/constant'

@Injectable()
export class EmailSenderService {
  constructor(
    @Inject(SMTP_TRANSPORTER)
    private transport: Transporter
  ) {}

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
