import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { User } from 'src/entity/User';
import { decodeToken, encodeJwt, encodeRefreshJwt } from './jwt.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, @Inject('MESSAGES_SERVICE') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.userService.getOneByLogin(loginDto.login);

    if (!user) throw new UnauthorizedException('Неверный логин или пароль');

    const isEqualPasswords = await this.userService.comparePasswords(loginDto.password, user.password);

    if (!isEqualPasswords) throw new UnauthorizedException('Неверный логин или пароль');

    const tokens = this.signTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async register(registerDto: RegisterUserDto) {
    const candidate = await this.userService.getOneByLogin(registerDto.login);

    if (candidate) throw new BadRequestException('Пользователь с таким логином уже существует');

    const user = await this.userService.create(registerDto);
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

    const isValidPrevPassword = this.userService.comparePasswords(dto.currentPassword, candidate.password);

    if (!isValidPrevPassword) throw new BadRequestException('Прошлый пароль не совпадает');

    const isValidNewPassword = dto.password === dto.verificationPassword;

    if (!isValidNewPassword) throw new BadRequestException('Пароли не совпадают');

    return this.userService.updateOne(userId, { password: dto.password });
  }

  async remindPassword(dto: ForgotPasswordDto) {
    const candidate = await this.userService.getOneByLogin(dto.login);

    if (!candidate) throw new NotFoundException('Пользователь не найден');

    const password = '1234';

    const updatedUser = await this.userService.updateOne(candidate.id, {
      password,
    });

    if (!updatedUser) throw new BadRequestException('Не удалось изменить пароль');

    try {
      await this.sendEmail({
        email: candidate.login,
        subject: 'Восстановление пароля для входа в Dashboard Tastyoleg',
        content: `Ваш пароль: ${password}`,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Ошибка при отправке пароля');
    }

    return {
      result: true,
    };
  }

  async getCurrentUser(userId: number) {
    return this.userService.getOneById(userId);
  }

  async sendEmail(dto: SendEmailDto) {
    return firstValueFrom(this.client.send('send-email', dto));
  }
}
