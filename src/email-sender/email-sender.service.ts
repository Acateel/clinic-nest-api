import { Inject, Injectable } from '@nestjs/common'
import { Transporter } from 'nodemailer'
import { transformHTMLTemplate } from './util'
import { SMTP_TRANSPORTER } from 'src/common/constant'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from 'src/common/app-config'

@Injectable()
export class EmailSenderService {
  private templatesPath

  constructor(
    @Inject(SMTP_TRANSPORTER)
    private transport: Transporter,
    private configServise: ConfigService<AppConfig, true>
  ) {
    this.templatesPath = this.configServise.get('nodemail.templatePath', {
      infer: true,
    })
  }

  async sendAuthCodeByEmail(emailTo: string, code: string) {
    const emailHtml = transformHTMLTemplate(this.templatesPath, { code })

    await this.transport.sendMail({
      from: 'Clinic node api',
      to: emailTo,
      subject: 'Authorization by sended code',
      html: emailHtml,
    })
  }
}
