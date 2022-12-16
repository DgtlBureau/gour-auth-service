import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { generate as generatePassword } from 'generate-password';

import { verifyAccessJwt } from '../../common/services/jwt.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterWithoutPasswordUserDto } from './dto/register-user-without-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/entity/User';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @MessagePattern('get-current-user')
  getCurrentUser(@Payload() id: number) {
    return this.userService.getOneById(id);
  }

  @MessagePattern('signup')
  register(@Payload() { name, lastName, email, role }: RegisterWithoutPasswordUserDto) {
    const password = generatePassword();

    return this.authService.register({ name, lastName, email, role, password });
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
