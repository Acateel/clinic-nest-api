import { Injectable } from '@nestjs/common';
import { CreateAuthcodeDto } from './dto/create-authcode.dto';
import { UpdateAuthcodeDto } from './dto/update-authcode.dto';

@Injectable()
export class AuthcodeService {
  create(createAuthcodeDto: CreateAuthcodeDto) {
    return 'This action adds a new authcode';
  }

  findAll() {
    return `This action returns all authcode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authcode`;
  }

  update(id: number, updateAuthcodeDto: UpdateAuthcodeDto) {
    return `This action updates a #${id} authcode`;
  }

  remove(id: number) {
    return `This action removes a #${id} authcode`;
  }
}
