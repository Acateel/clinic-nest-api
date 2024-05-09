import { Module } from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { DepartamentController } from './departament.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartamentController],
  providers: [DepartamentService],
})
export class DepartamentModule {}
