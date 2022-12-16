import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { generate as generatePassword } from 'generate-password';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/entity/User';
import { decodeToken, encodeJwt, encodeRefreshJwt } from '../../common/services/jwt.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/common/services/email.service';
import { PasswordService } from 'src/common/services/password.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MESSAGES_SERVICE') private client: ClientProxy,

    private userService: UserService,
    private emailService: EmailService,
    private passService: PasswordService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async login(dto: LoginUserDto) {
    const user = await this.userService.getOneByLogin(dto.email);

    if (!user) throw new UnauthorizedException('Неверный логин или пароль');

    const isEqualPasswords = await this.passService.compare(dto.password, user.password);

    if (!isEqualPasswords) throw new UnauthorizedException('Неверный логин или пароль');

    const tokens = this.signTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async register({ name, lastName, email, role, password }: RegisterUserDto) {
    const user = await this.userService.create({
      name,
      lastName,
      email,
      password,
      role,
    });

    const tokens = this.signTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  refresh(token: string) {
    const user = decodeToken(token) as { id: number };

    if (!user) throw new UnauthorizedException();

    const payload = {
      id: user.id, // FIXME: стандартизировать юзера для jwt
    };

    const accessToken = encodeJwt(payload, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = encodeRefreshJwt(payload, process.env.REFRESH_TOKEN_SECRET);

    return { accessToken, refreshToken };
  }

  private signTokens(user: Omit<User, 'password'>) {
    const payload = {
      id: user.id,
      role: user.roles,
    };

    const accessToken = encodeJwt(payload, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = encodeRefreshJwt(payload, process.env.REFRESH_TOKEN_SECRET);

    return { accessToken, refreshToken };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const candidate = await this.userService.getOneById(userId);

    const isValidPrevPassword = this.passService.compare(dto.currentPassword, candidate.password);

    if (!isValidPrevPassword) throw new BadRequestException('Прошлый пароль не совпадает');

    const isValidNewPassword = dto.password === dto.verificationPassword;

    if (!isValidNewPassword) throw new BadRequestException('Пароли не совпадают');

    try {
      await this.emailService.send({
        email: candidate.login,
        subject: 'Изменение пароля для входа в Dashboard Tastyoleg',
        content: `Ваш новый пароль: ${dto.password}`,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Ошибка при отправке пароля');
    }

    const updatedUser = await this.userService.update(userId, { password: dto.password });

    if (!updatedUser) throw new BadRequestException('Не удалось изменить пароль');

    return {
      result: true,
    };
  }

  async remindPassword(dto: ForgotPasswordDto) {
    const candidate = await this.userService.getOneByLogin(dto.login);

    if (!candidate) throw new NotFoundException('Пользователь не найден');

    const password = generatePassword();
    const hashedPassword = await this.passService.hash(password);

    try {
      await this.emailService.send({
        email: candidate.login,
        subject: 'Восстановление пароля для входа в Dashboard Tastyoleg',
        content: `Ваш новый пароль: ${password}`,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Ошибка при отправке пароля');
    }

    const updatedUser = await this.userService.update(candidate.id, {
      password: hashedPassword,
    });

    if (!updatedUser) throw new BadRequestException('Не удалось изменить пароль');

    return {
      result: true,
    };
  }
}
