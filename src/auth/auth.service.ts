import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { SigninUserDto } from './dto/signin-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { ConfigService } from '@nestjs/config'
import { UserService } from 'src/user/user.service'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserRole } from 'src/user/entities/user.entity'
import { Repository } from 'typeorm'
import { formatPhoneNumber } from 'src/util/format-phone-number'
import { compare, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async signup({ email, phoneNumber, password, role }: CreateUserDto) {
    if (!email && !phoneNumber) {
      throw new NotFoundException(
        'Credentials incorrect, need email or phone number for signup'
      )
    }

    await this.userService.checkUserExist(email, phoneNumber)

    const user = new User()
    user.email = email
    user.phoneNumber = formatPhoneNumber(phoneNumber)
    const bcryptSalt = this.configService.getOrThrow('BCRYPT_SALT')
    user.password = await hash(password, bcryptSalt)
    user.role = role

    const result = await this.userRepo.save(user)

    return result
  }

  async signin({ login, password }: SigninUserDto) {
    const user =
      (await this.userService.findByEmail(login)) ??
      (await this.userService.findByPhoneNumber(login))

    if (!user) {
      throw new NotFoundException('Credentials incorrect')
    }

    const pwMatches = await compare(password, user.password)
    if (!pwMatches) {
      throw new NotFoundException('Credentials incorrect')
    }

    return await this.getToken(user.id, user.role)
  }

  async login(userDto: LoginUserDto) {}

  async getToken(id: number, role: UserRole) {
    const payload = { sub: id, role: role }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
