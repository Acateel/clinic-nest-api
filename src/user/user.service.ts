import { ConflictException, Injectable } from '@nestjs/common'
import { DeleteResult, Repository } from 'typeorm'
import { User } from '../database/entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async create({
    email,
    phoneNumber,
    password,
    role,
  }: CreateUserDto): Promise<User> {
    const user = new User()

    user.email = email
    user.phoneNumber = phoneNumber
    user.password = password
    user.role = role

    const result = await this.userRepo.save(user)

    delete result.password

    return result
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepo.find()

    return users
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id })

    return user
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()

    return user
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.phoneNumber = :phoneNumber', { phoneNumber })
      .getOne()

    return user
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.userRepo.delete(id)

    return result
  }

  async checkUserExist(email: string, phoneNumber: string): Promise<void> {
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
