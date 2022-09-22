import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
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
    return this.userRepository.find({}); // FIXME: нужен ли функционал поиска по ролям?
  }

  async getOneById(id: number, params?: { withPassword: boolean }) {
    try {
      return this.userRepository.findOneOrFail(id);
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
        const role = await this.roleService.findOne(roleId);

        fields.roles.push(role);
      }
    }

    return this.userRepository.save(fields);
  }

  async updateOne(id: number, { roleIds, ...userDto }: UpdateUserDto) {
    const candidate = await this.userRepository.findOne(id);

    if (!candidate) throw new NotFoundException('Пользователь не найден');

    const fields: DeepPartial<User> = formatFields<Partial<User>>(['login', 'name', 'password', 'isApproved'], userDto);

    if (roleIds) {
      fields.roles ??= [];

      for (const roleId of roleIds) {
        const role = await this.roleService.findOne(roleId);

        fields.roles.push(role);
      }
    }

    fields.password &&= await this.hashPassword(fields.password);

    return this.userRepository.save({ id, ...fields });
  }

  async deleteOne(id: number) {
    const { affected: deletedRows } = await this.userRepository.delete(id);

    if (!deletedRows) throw new BadRequestException(`Пользователь не существует`);

    return deletedRows;
  }

  comparePasswords(pass: string, encrypted: string) {
    return bcrypt.compare(pass, encrypted);
  }

  private hashPassword(pass: string) {
    return bcrypt.hash(pass, SALT);
  }
}
