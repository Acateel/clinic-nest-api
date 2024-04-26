import { Module } from '@nestjs/common'
import { AuthcodeService } from './authcode.service'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [AuthcodeService],
  exports: [AuthcodeService],
})
export class AuthcodeModule {}
