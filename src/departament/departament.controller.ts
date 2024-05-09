import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DepartamentService } from './departament.service'
import { CreateDepartamentDto } from './dto/create-departament.dto'
import { UpdateDepartamentDto } from './dto/update-departament.dto'

@Controller('departament')
export class DepartamentController {
  constructor(private readonly departamentService: DepartamentService) {}

  @Post()
  create(@Body() createDepartamentDto: CreateDepartamentDto) {
    return this.departamentService.create(createDepartamentDto)
  }

  @Get()
  findAll() {
    return this.departamentService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.departamentService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDepartamentDto: UpdateDepartamentDto
  ) {
    return this.departamentService.update(id, updateDepartamentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.departamentService.remove(id)
  }
}
