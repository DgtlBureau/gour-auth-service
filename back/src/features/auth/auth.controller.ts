import { BadRequestException, Controller, Req, Res } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Request, Response } from 'express';
import generatePassword from 'generate-password';

import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterWithoutPasswordUserDto } from './dto/register-user-without-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly cookieService: CookieService) {}

  @MessagePattern('signup')
  async register(@Payload() userDto: RegisterWithoutPasswordUserDto, @Res() res: Response) {
    const password = generatePassword.generate();
    const { user, accessToken, refreshToken } = await this.authService.register({ ...userDto, password });

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return user;
  }

  @MessagePattern('signup-without-password')
  async registerWithoutPassword(@Payload() userDto: RegisterUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.register(userDto);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return user;
  }

  @MessagePattern('signin')
  async login(@Payload() userDto: LoginUserDto, @Res() res: Response) {
    const { user, accessToken, refreshToken } = await this.authService.login(userDto);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);

    return user;
  }

  @MessagePattern('sign-out')
  signOut(@Res() res: Response) {
    this.cookieService.clearAllTokens(res);
  }

  @MessagePattern('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldRefreshToken = req.cookies[this.cookieService.ACCESS_TOKEN_NAME];

    if (!oldRefreshToken) {
      throw new BadRequestException('Нет токена для авторизации');
    }

    const { accessToken, refreshToken } = this.authService.refresh(oldRefreshToken);

    this.cookieService.setAccessToken(res, accessToken);
    this.cookieService.setRefreshToken(res, refreshToken);
  }
}
