import { Module } from '@nestjs/common'
import { DoctorService } from './doctor.service'
import { DoctorController } from './doctor.controller'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
