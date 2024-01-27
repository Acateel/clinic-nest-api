import { ConflictException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findAll() {
    const users = await this.userRepo.find()

    const result = users.map((user) => {
      delete user.password
      return user
    })

    return result
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id })

    delete user.password

    return user
  }

  async findByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email })

    return user
  }

  async findByPhoneNumber(phoneNumber: string) {
    const user = await this.userRepo.findOneBy({ phoneNumber })

    return user
  }

  async remove(id: number) {
    const result = await this.userRepo.delete(id)

    return result
  }

  async checkUserExist(email: string, phoneNumber: string) {
    if (email) {
      const user = await this.findByEmail(email)

      if (user) {
        throw new ConflictException('User with this email exist')
      }
    }

    if (phoneNumber) {
      const user = await this.findByPhoneNumber(phoneNumber)

      if (user) {
        throw new ConflictException('User with this phoneNumber exist')
      }
    }
  }
}
