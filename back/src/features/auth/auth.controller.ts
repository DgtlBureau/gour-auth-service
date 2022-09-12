import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import generatePassword from 'generate-password';

import { verifyAccessJwt } from './jwt.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterWithoutPasswordUserDto } from './dto/register-user-without-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/entity/User';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('get-current-user')
  getCurrentUser(@Payload() id: number) {
    return this.authService.getCurrentUser(id);
  }

  @MessagePattern('signup')
  register(@Payload() dto: RegisterWithoutPasswordUserDto) {
    const password = generatePassword.generate();

    return this.authService.register({ ...dto, password });
  }

  @MessagePattern('signup-without-password')
  registerWithoutPassword(@Payload() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @MessagePattern('signin')
  login(@Payload() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() oldRefreshToken: string) {
    return this.authService.refresh(oldRefreshToken);
  }

  // TODO: /checkAccess

  @MessagePattern('change-password')
  changePassword(@Payload('user') user: User, @Payload('dto') dto: ChangePasswordDto) {
    return this.authService.changePassword(user.id, dto);
  }

  @MessagePattern('forgot-password')
  remindPassword(@Payload() dto: ForgotPasswordDto) {
    return this.authService.remindPassword(dto);
  }

  @MessagePattern('check-token')
  checkToken(@Payload() token: string) {
    return {
      result: verifyAccessJwt(token, process.env.ACCESS_TOKEN_SECRET),
    };
  }
}
