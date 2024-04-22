import { Module } from '@nestjs/common'
import { SmsSenderService } from './sms-sender.service'
import { ConfigService } from '@nestjs/config'
import { TWILIO_TRANSPORTER } from 'src/common/constant'
import * as twilio from 'twilio'
import { AppConfig } from 'src/common/app-config'

@Module({
  providers: [
    {
      provide: TWILIO_TRANSPORTER,
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const { accountSid, authToken } = configService.get('twilio')
        return twilio(accountSid, authToken)
      },
      inject: [ConfigService],
    },
    SmsSenderService,
  ],
  exports: [SmsSenderService],
})
export class SmsSenderModule {}
