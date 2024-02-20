import { Injectable } from '@nestjs/common'
import { MoreThanOrEqual, Repository } from 'typeorm'
import { Authcode } from '../database/entities/authcode.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/database/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { compare, hash } from 'bcrypt'

@Injectable()
export class AuthcodeService {
  constructor(
    @InjectRepository(Authcode)
    private authcodeRepo: Repository<Authcode>,
    private configService: ConfigService<envConfig>
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

  async checkCodes(authcodes: Authcode[], code: string) {
    for (let authcode of authcodes) {
      if (await compare(code, authcode.code)) {
        return true
      }
    }
    return false
  }
}
