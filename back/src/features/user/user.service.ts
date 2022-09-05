import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ApiUser } from 'src/entity/ApiUser';
import { ApiRole } from 'src/entity/ApiRole';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatFields } from 'src/utils/formatFields';
import { RoleService } from '../role/role.service';

const SALT = 5;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(ApiUser)
    private userRepository: Repository<ApiUser>,
    private roleService: RoleService,
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
    const { login, name, password, isApproved = false, roleIds } = dto;

    const hashedPassword = await this.hashPassword(password);
    const roles = [];
    if (roleIds?.length) {
      for (const roleId of roleIds) {
        roles.push(await this.roleService.findOne(roleId));
      }
    }

    const { password: _, ...user } = await this.userRepository.save({
      login,
      name,
      password: hashedPassword,
      isApproved,
      roles,
    });
    return user;
  }

  async updateOne(uuid: string, { roleIds, ...userDto }: UpdateUserDto) {
    const fieldsForUpdate: Partial<ApiUser> = { ...userDto };

    if (roleIds) {
      fieldsForUpdate.roles = [];
      for (const roleId of roleIds) {
        fieldsForUpdate.roles.push(await this.roleService.findOne(roleId));
      }
    }

    const fields = formatFields<Partial<ApiUser>>(
      ['login', 'name', 'password', 'roles', 'isApproved'],
      fieldsForUpdate,
    );
    fields.password &&= await this.hashPassword(fields.password);

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

  comparePasswords(pass: string, encrypted: string) {
    return bcrypt.compare(pass, encrypted);
  }

  private hashPassword(pass: string) {
    return bcrypt.hash(pass, SALT);
  }
}
