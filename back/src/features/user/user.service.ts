import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ApiUser } from 'src/entity/ApiUser';
import { ApiRole } from 'src/entity/ApiRole';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatFields } from 'src/utils/formatFields';

const SALT = 5;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ApiUser)
    private userRepository: Repository<ApiUser>,
  ) {}

  async getAllByRoles(roles: ApiRole[]) {
    const users = await this.userRepository.find();

    if (!roles.length) return users;

    return users
      .filter((user) => user.roles.some((role) => roles.includes(role)))
      .map(({ password: _, ...user }) => user);
  }

  async getOneByUuid(uuid: string) {
    try {
      const { password: _, ...user } = await this.userRepository.findOneOrFail(uuid);
      return user;
    } catch {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  getOneByLogin(login: string) {
    return this.userRepository.findOne({ login });
  }

  async create(dto: CreateUserDto) {
    const { login, name, password } = dto;

    const hashedPassword = await this.hashPassword(password);

    const { password: _, ...user } = await this.userRepository.save({
      login,
      name,
      password: hashedPassword,
    });
    return user;
  }

  async updateOne(uuid: string, userDto: UpdateUserDto) {
    const fields = formatFields<UpdateUserDto>(['login', 'name', 'password'], userDto);

    const { affected: updatedRows } = await this.userRepository.update(uuid, fields);

    if (!updatedRows) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async deleteOne(uuid: string) {
    const { affected: deletedRows } = await this.userRepository.delete(uuid);

    if (!deletedRows) {
      throw new BadRequestException(`Пользователь не существует`);
    }
  }

  hashPassword(pass: string) {
    return bcrypt.hash(pass, SALT);
  }

  async comparePasswords(pass: string, encrypted: string) {
    return bcrypt.compare(pass, encrypted);
  }
}
