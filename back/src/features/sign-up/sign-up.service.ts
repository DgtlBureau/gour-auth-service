import { Injectable } from '@nestjs/common';
import { CreateSignUpDto } from './dto/create-sign-up.dto';
import { UpdateSignUpDto } from './dto/update-sign-up.dto';

@Injectable()
export class SignUpService {
  create(createSignUpDto: CreateSignUpDto) {
    return 'This action adds a new signUp';
  }

  findAll() {
    return `This action returns all signUp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} signUp`;
  }

  update(id: number, updateSignUpDto: UpdateSignUpDto) {
    return `This action updates a #${id} signUp`;
  }

  remove(id: number) {
    return `This action removes a #${id} signUp`;
  }
}
