import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { Roles } from 'src/auth/guard/roles.decorator'
import { UserRole } from 'src/common/user-role-enum'
import { RolesGuard } from 'src/auth/guard/roles.guard'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.Admin)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id)
  }
}
