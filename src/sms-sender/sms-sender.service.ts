import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { envConfig } from 'src/common/env-config'
import * as twilio from 'twilio'

@Injectable()
export class SmsSenderService {
  private messagingServiceSid: string
  private client: twilio.Twilio

  constructor(private configService: ConfigService<envConfig>) {
    const accountSid = this.configService.getOrThrow('TWILIO_ACCOUNT_SID')
    const authToken = this.configService.getOrThrow('TWILIO_AUTH_TOKEN')
    this.messagingServiceSid = this.configService.getOrThrow(
      'TWILIO_MESSAGING_SERVICE_SID'
    )
    this.client = twilio(accountSid, authToken)
  }

  async sendAuthCodeBySMS(phoneNumber: string, code: string) {
    await this.client.messages.create({
      body: `Verification code: ${code}`,
      messagingServiceSid: this.messagingServiceSid,
      to: phoneNumber,
    })
  }
}
