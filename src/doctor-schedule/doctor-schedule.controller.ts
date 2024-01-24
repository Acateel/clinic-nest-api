import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DoctorScheduleService } from './doctor-schedule.service'
import { CreateDoctorScheduleDto } from './dto/create-doctor-schedule.dto'
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto'

@Controller('doctors/:doctorId/schedules')
export class DoctorScheduleController {
  constructor(private readonly doctorScheduleService: DoctorScheduleService) {}

  @Post()
  create(
    @Param('doctorId') doctorId: number,
    @Body() createDoctorScheduleDto: CreateDoctorScheduleDto
  ) {
    return this.doctorScheduleService.create(doctorId, createDoctorScheduleDto)
  }

  @Get()
  findAll(@Param('doctorId') doctorId: number) {
    return this.doctorScheduleService.findByDoctorId(doctorId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorScheduleService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('doctorId') doctorId: number,
    @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto
  ) {
    return this.doctorScheduleService.update(
      +id,
      doctorId,
      updateDoctorScheduleDto
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorScheduleService.remove(+id)
  }
}
