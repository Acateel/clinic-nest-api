import { Module } from '@nestjs/common'
import { AuthcodeService } from './authcode.service'
import { AuthcodeController } from './authcode.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Authcode } from './entities/authcode.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Authcode])],
  controllers: [AuthcodeController],
  providers: [AuthcodeService],
})
export class AuthcodeModule {}
