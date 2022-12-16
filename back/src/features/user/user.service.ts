import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

import { User } from 'src/entity/User';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { UserGetOneDto } from './dto/user-get-one.dto';
import { PasswordService } from 'src/common/services/password.service';
import { EmailService } from 'src/common/services/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private roleService: RoleService,
    private passService: PasswordService,
    private emailService: EmailService,
  ) {}

  async getAll() {
    return this.userRepository.find();
  }

  async getOneById(id: number, params?: UserGetOneDto) {
    try {
      const options: FindOneOptions<User> = {
        relations: [params.withPassword && 'password'],
      };
      return this.userRepository.findOneOrFail(id, options);
    } catch {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  getOneByLogin(login: string) {
    return this.userRepository.findOne({ login });
  }

  async create({ name, lastName, email: login, password, role: roleKey }: CreateUserDto) {
    const candidate = await this.getOneByLogin(login);

    if (candidate) throw new BadRequestException('Пользователь с таким логином уже существует');

    if (!password) password = this.passService.generate();

    const hashedPassword = await this.passService.hash(password);

    try {
      await this.emailService.send({
        email: candidate.login,
        subject: 'Пароль для входа в Dashboard Tastyoleg',
        content: `Ваш пароль: ${password}`,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Ошибка при отправке пароля');
    }

    const role = await this.roleService.findOneByKey(roleKey);

    if (!role) throw new NotFoundException('Роль не найдена');

    const fullName = `${name} ${lastName}`;

    return this.userRepository.save({
      login,
      name: fullName,
      password: hashedPassword,
      roles: [role],
    });
  }

  async update(id: number, { name, lastName, email: login, password, role: roleKey }: UpdateUserDto) {
    const candidate = await this.userRepository.findOne(id);

    if (!candidate) throw new NotFoundException('Пользователь не найден');

    const fields: DeepPartial<User> = {};

    if (login) {
      const user = await this.userRepository.findOne({ where: { login } });

      if (user) throw new BadRequestException('Пользователь с таким email уже существует');

      fields.login = login;
    }

    if (name || lastName) {
      const splitedName = candidate.name.split(' ');
      const oldName = splitedName[0];
      const oldLastName = splitedName[1];
      const fullName = `${name || oldName} ${lastName || oldLastName}`;

      fields.name = fullName;
    }

    if (roleKey) {
      fields.roles ??= [];

      const role = await this.roleService.findOneByKey(roleKey);

      if (!role) throw new NotFoundException('Роль не найдена');

      fields.roles = [role];
    }

    if (password) {
      const hashedPassword = await this.passService.hash(fields.password);

      try {
        await this.emailService.send({
          email: candidate.login,
          subject: 'Пароль для входа в Dashboard Tastyoleg',
          content: `Ваш новый пароль: ${fields.password}`,
        });
      } catch (error) {
        console.error(error);
        throw new BadRequestException('Ошибка при отправке пароля');
      }

      fields.password = hashedPassword;
    }

    return this.userRepository.save({ ...candidate, ...fields });
  }

  async delete(id: number) {
    const { affected: deletedRows } = await this.userRepository.delete(id);

    if (!deletedRows) throw new BadRequestException(`Пользователь не существует`);

    return deletedRows;
  }
}
