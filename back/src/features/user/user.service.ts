import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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
    const fields: DeepPartial<ApiUser> = formatFields<Partial<ApiUser>>(['login', 'name', 'isApproved'], dto);

    fields.password = await this.hashPassword(dto.password);

    if (dto.roleIds?.length) {
      for (const roleId of dto.roleIds) {
        fields.roles.push(await this.roleService.findOne(roleId));
      }
    }

    const { password: _, ...user } = await this.userRepository.save(fields);
    return user;
  }

  async updateOne(uuid: string, { roleIds, ...userDto }: UpdateUserDto) {
    const candidate = await this.userRepository.findOne(uuid);

    if (!candidate) {
      throw new NotFoundException('Пользователь не найден');
    }

    const fields: DeepPartial<ApiUser> = formatFields<Partial<ApiUser>>(
      ['login', 'name', 'password', 'isApproved'],
      userDto,
    );

    if (roleIds) {
      fields.roles ??= [];
      for (const roleId of roleIds) {
        fields.roles.push(await this.roleService.findOne(roleId)); // TODO: fix relations
      }
    }
    fields.password &&= await this.hashPassword(fields.password);

    const { password: _, ...user } = await this.userRepository.save({ uuid, ...fields });
    return user;
  }

  async deleteOne(uuid: string) {
    const { affected: deletedRows } = await this.userRepository.delete(uuid);

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
