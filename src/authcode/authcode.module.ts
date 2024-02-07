import { Module } from '@nestjs/common'
import { AuthcodeService } from './authcode.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Authcode } from '../database/entities/authcode.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Authcode])],
  providers: [AuthcodeService],
  exports: [AuthcodeService],
})
export class AuthcodeModule {}
