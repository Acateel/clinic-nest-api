import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import * as dotenv from 'dotenv'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/database/entities/user.entity'
import { AuthcodeModule } from 'src/authcode/authcode.module'
import { EmailSenderModule } from 'src/email-sender/email-sender.module'
import { SmsSenderModule } from 'src/sms-sender/sms-sender.module'

dotenv.config()

@Module({
  imports: [
    UserModule,
    AuthcodeModule,
    EmailSenderModule,
    SmsSenderModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
