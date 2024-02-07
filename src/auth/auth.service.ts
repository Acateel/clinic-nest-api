import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { SigninUserDto } from './dto/signin-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { ConfigService } from '@nestjs/config'
import { UserService } from 'src/user/user.service'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserRole } from 'src/database/entities/user.entity'
import { Repository } from 'typeorm'
import { formatPhoneNumber } from 'src/util/format-phone-number'
import { compare, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { generatePassword } from 'src/util/password_generator'
import { generateCode } from 'src/util/generate-code'
import { AuthcodeService } from 'src/authcode/authcode.service'
import { EmailSenderService } from 'src/email-sender/email-sender.service'
import { SmsSenderService } from 'src/sms-sender/sms-sender.service'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private authcodeService: AuthcodeService,
    private jwtService: JwtService,
    private emailSenderService: EmailSenderService,
    private smsSenderService: SmsSenderService
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

  async login({ email, phoneNumber, code, role }: LoginUserDto) {
    if (!email && !phoneNumber) {
      throw new BadRequestException('Dont have email or phone number')
    }

    if (email && phoneNumber) {
      throw new BadRequestException('Need select email or phone number')
    }

    let user

    if (email) {
      user = await this.userService.findByEmail(email)
    }

    if (phoneNumber) {
      user = await this.userService.findByPhoneNumber(phoneNumber)
    }

    if (!user) {
      user = await this.signup({
        email,
        phoneNumber,
        password: generatePassword(),
        role,
      })
    }

    if (!code) {
      const generatedCode = generateCode()

      await this.authcodeService.create(user, generatedCode)

      if (email) {
        this.emailSenderService.sendAuthCodeByEmail(email, generatedCode)
      }

      if (phoneNumber) {
        this.smsSenderService.sendAuthCodeBySMS(phoneNumber, generatedCode)
      }

      return { message: 'code sended' }
    }

    const authcodes = await this.authcodeService.findByUser(user)

    const verify = await this.authcodeService.checkCodes(authcodes, code)

    if (!verify) {
      throw new ForbiddenException('Code dont match')
    }

    this.authcodeService.removeByUser(user)

    return this.getToken(user.id, user.role)
  }

  async getToken(id: number, role: UserRole) {
    const payload = { sub: id, role: role }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }
}
