import * as twilio from 'twilio'
import * as dotenv from 'dotenv'
import { ConfigService } from '@nestjs/config'

dotenv.config()

const configService = new ConfigService()

const accountSid = configService.getOrThrow('TWILIO_ACCOUNT_SID')
const authToken = configService.getOrThrow('TWILIO_AUTH_TOKEN')
const messagingServiceSid = configService.getOrThrow(
  'TWILIO_MESSAGING_SERVICE_SID'
)
const client = twilio(accountSid, authToken)

export async function sendAuthCodeBySMS(phoneNumber: string, code: string) {
  await client.messages.create({
    body: `Verification code: ${code}`,
    messagingServiceSid: messagingServiceSid,
    to: phoneNumber,
  })
}
