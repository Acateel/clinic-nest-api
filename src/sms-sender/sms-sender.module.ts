import { Module } from '@nestjs/common'
import { SmsSenderService } from './sms-sender.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [SmsSenderService],
  exports: [SmsSenderService],
})
export class SmsSenderModule {}
