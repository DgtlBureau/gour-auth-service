import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiUser } from 'src/entity/ApiUser';
import { ApiRole } from 'src/entity/ApiRole';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ApiUser)
    private userRepository: Repository<ApiUser>,
  ) {}

  async getAllByRoles(roles: ApiRole[]) {
    const users = await this.userRepository.find();

    if (!roles.length) return users;

    return users.filter((user) =>
      user.roles.some((role) => roles.includes(role)),
    );
  }

  async getOneByUuid(uuid: string) {
    try {
      return await this.userRepository.findOneOrFail(uuid);
    } catch {
      throw new NotFoundException('Пользователь с таким id не найден');
    }
  }

  async create(dto: CreateUserDto) {
    const { login, name, password } = dto;

    return this.userRepository.save({
      login,
      name,
      password: 'pass',
    });
  }

  async updateOne(uuid: string, userDto: UpdateUserDto) {
    const { login, name, password } = userDto;

    try {
      return await this.userRepository.update(uuid, { login, name, password });
    } catch {
      console.log('error!!!!!');
    }
  }

  deleteOne(uuid: string) {
    return this.userRepository.delete(uuid);
  }
}
