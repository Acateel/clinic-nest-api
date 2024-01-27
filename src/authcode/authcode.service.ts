import { Injectable } from '@nestjs/common'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { Authcode } from './entities/authcode.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { hash } from 'bcrypt'

@Injectable()
export class AuthcodeService {
  constructor(
    @InjectRepository(Authcode)
    private authcodeRepo: Repository<Authcode>,
    private configService: ConfigService
  ) {}

  async create(user: User, code: string) {
    const authcode = new Authcode()
    authcode.user = user

    const bctyptSalt = this.configService.getOrThrow('BCRYPT_SALT')
    authcode.code = await hash(code, bctyptSalt)

    const result = await this.authcodeRepo.save(authcode)

    return result
  }

  async findByUser(user: User) {
    const delayInMinutes = 15
    const date = new Date()
    date.setMinutes(date.getMinutes() - delayInMinutes)

    const authcodes = await this.authcodeRepo.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
        createdAt: MoreThanOrEqual(date),
      },
    })

    return authcodes
  }

  async removeByUser(user: User) {
    const result = await this.authcodeRepo.delete({ user })

    return result
  }
}
