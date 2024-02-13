import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Roles } from 'src/auth/guard/roles.decorator'
import { UserRole } from 'src/database/entities/user.entity'
import { RolesGuard } from 'src/auth/guard/roles.guard'

@Controller('users')
@UseGuards(RolesGuard)
@Roles(UserRole.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id)
  }
}
