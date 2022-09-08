import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/entity/User';
import { Role } from 'src/entity/Role';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatFields } from 'src/utils/formatFields';
import { RoleService } from '../role/role.service';

const SALT = 5;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async getAllByRoles(roles: Role[]) {
    const users = await this.userRepository.find();

    if (!roles.length) return users;

    return users
      .filter((user) => user.roles.some((role) => roles.includes(role)))
      .map(({ password: _, ...user }) => user);
  }

  async getOneById(id: number) {
    try {
      const { password: _, ...user } = await this.userRepository.findOneOrFail(id);
      return user;
    } catch {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  getOneByLogin(login: string) {
    return this.userRepository.findOne({ login });
  }

  async create(dto: CreateUserDto) {
    const fields: DeepPartial<User> = formatFields<Partial<User>>(['login', 'name', 'isApproved'], dto);

    fields.password = await this.hashPassword(dto.password);

    if (dto.roleIds?.length) {
      for (const roleId of dto.roleIds) {
        fields.roles.push(await this.roleService.findOne(roleId));
      }
    }

    const { password: _, ...user } = await this.userRepository.save(fields);
    return user;
  }

  async updateOne(id: number, { roleIds, ...userDto }: UpdateUserDto) {
    const candidate = await this.userRepository.findOne(id);

    if (!candidate) {
      throw new NotFoundException('Пользователь не найден');
    }

    const fields: DeepPartial<User> = formatFields<Partial<User>>(['login', 'name', 'password', 'isApproved'], userDto);

    if (roleIds) {
      fields.roles ??= [];
      for (const roleId of roleIds) {
        fields.roles.push(await this.roleService.findOne(roleId));
      }
    }
    fields.password &&= await this.hashPassword(fields.password);

    const { password: _, ...user } = await this.userRepository.save({ id, ...fields });
    return user;
  }

  async deleteOne(id: number) {
    const { affected: deletedRows } = await this.userRepository.delete(id);

    if (!deletedRows) {
      throw new BadRequestException(`Пользователь не существует`);
    }
    return {}; // TODO: убрать возврат пустого объекта
  }

  comparePasswords(pass: string, encrypted: string) {
    return bcrypt.compare(pass, encrypted);
  }

  private hashPassword(pass: string) {
    return bcrypt.hash(pass, SALT);
  }
}
