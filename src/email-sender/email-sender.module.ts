import { Module } from '@nestjs/common'
import { EmailSenderService } from './email-sender.service'
import { ConfigService } from '@nestjs/config'
import { SMTP_TRANSPORTER } from 'src/common/constant'
import { AppConfig } from 'src/common/app-config'
import { createTransport } from 'nodemailer'

@Module({
  providers: [
    {
      provide: SMTP_TRANSPORTER,
      useFactory: (configService: ConfigService<AppConfig, true>) =>
        createTransport(configService.get('nodemail')),
      inject: [ConfigService],
    },
    EmailSenderService,
  ],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
