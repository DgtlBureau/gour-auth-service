import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { ApiUser } from 'src/entity/ApiUser';
import { decodeToken, encodeJwt, encodeRefreshJwt } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(loginDto: LoginUserDto) {
    const user = await this.userService.getOneByLogin(loginDto.login);

    if (!user) {
      throw new UnauthorizedException('Неверный логин');
    }

    const isEqualPasswords = await this.userService.comparePasswords(loginDto.password, user.password);

    if (isEqualPasswords) {
      const tokens = this.signTokens(user);

      return {
        user,
        ...tokens,
      };
    } else {
      throw new UnauthorizedException('Неверный пароль');
    }
  }

  async register(registerDto: RegisterUserDto) {
    const candidate = await this.userService.getOneByLogin(registerDto.login);
    if (candidate) {
      throw new BadRequestException('Пользователь с таким логином уже существует');
    }

    const user = await this.userService.create(registerDto);
    const tokens = this.signTokens(user);
    return {
      user,
      ...tokens,
    };
  }

  refresh(@Payload() token: string) {
    const user = decodeToken(token) as { id: number };

    if (!user) throw new UnauthorizedException();

    const payload = {
      id: user.id, // FIXME: стандартизировать юзера для jwt
    };

    const accessToken = encodeJwt(payload);
    const refreshToken = encodeRefreshJwt(payload);

    return { accessToken, refreshToken };
  }

  private signTokens(user: Omit<ApiUser, 'password'>) {
    const payload = {
      id: user.id,
      role: user.roles,
    };

    const accessToken = encodeJwt(payload);
    const refreshToken = encodeRefreshJwt(payload);

    return { accessToken, refreshToken };
  }
}
