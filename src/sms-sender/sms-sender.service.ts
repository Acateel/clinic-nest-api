import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppConfig } from 'src/common/app-config'
import { TWILIO_TRANSPORTER } from 'src/common/constant'
import { envConfig } from 'src/common/env-config'
import { Twilio } from 'twilio'

@Injectable()
export class SmsSenderService {
  private messagingServiceSid: string

  constructor(
    @Inject(TWILIO_TRANSPORTER)
    private client: Twilio,
    private configService: ConfigService<AppConfig>
  ) {
    this.messagingServiceSid = this.configService.getOrThrow(
      'twilio.serviceSid',
      { infer: true }
    )
  }

  async sendAuthCodeBySMS(phoneNumber: string, code: string): Promise<void> {
    await this.client.messages.create({
      body: `Verification code: ${code}`,
      messagingServiceSid: this.messagingServiceSid,
      to: phoneNumber,
    })
  }
}
