import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { AuthService } from './auth.service'
import { SigninUserDto } from './dto/signin-user.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userDto: CreateUserDto) {
    await this.authService.signup(userDto)

    return this.authService.signin({
      login: userDto.email ?? userDto.phoneNumber,
      password: userDto.password,
    })
  }

  @Post('signin')
  async signin(@Body() userDto: SigninUserDto) {
    return await this.authService.signin(userDto)
  }
}
