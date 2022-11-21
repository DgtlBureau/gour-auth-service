import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { generate as generatePassword } from 'generate-password';

import { User } from 'src/entity/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';

const SALT = 5;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async getAll() {
    return this.userRepository.find();
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

  async create({ name, lastName, email, password, role: roleKey }: CreateUserDto) {
    const candidate = await this.getOneByLogin(email);

    if (candidate) throw new BadRequestException('Пользователь с таким логином уже существует');

    if (!password) password = generatePassword();

    const hashedPassword = await this.hashPassword(password);

    const role = await this.roleService.findOneByKey(roleKey);

    if (!role) throw new NotFoundException('Роль не найдена');

    return this.userRepository.save({
      login: email,
      name: `${name} ${lastName}`,
      password: hashedPassword,
      roles: [role],
    });
  }

  async updateOne(id: number, { name, lastName, email, password, role: roleKey }: UpdateUserDto) {
    const candidate = await this.userRepository.findOne(id);

    if (!candidate) throw new NotFoundException('Пользователь не найден');

    const fields: DeepPartial<User> = {};

    if (email) {
      const user = await this.userRepository.findOne({ where: { login: email } });

      if (user) throw new BadRequestException('Пользователь с таким email уже существует');

      fields.login = email;
    }

    if (name || lastName) {
      const splitedName = candidate.name.split(' ');
      const oldName = splitedName[0];
      const oldLastName = splitedName[1];

      fields.name = `${name || oldName} ${lastName || oldLastName}`;
    }

    if (roleKey) {
      fields.roles ??= [];

      const role = await this.roleService.findOneByKey(roleKey);

      if (!role) throw new NotFoundException('Роль не найдена');

      fields.roles = [role];
    }

    if (password) {
      const hashedPassword = await this.hashPassword(fields.password);

      fields.password = hashedPassword;
    }

    return this.userRepository.save({ ...candidate, ...fields });
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
