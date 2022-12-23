import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { verifyAccessJwt } from '../../common/services/jwt.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpWithoutPasswordDto } from './dto/signup-without-password.dto';
import { SignUpDto } from './dto/signup.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from 'src/entity/User';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserService } from '../user/user.service';
import { PasswordService } from 'src/common/services/password.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly passService: PasswordService,
  ) {}

  @MessagePattern('get-current-user')
  getCurrentUser(@Payload() id: number) {
    return this.userService.getOneById(id);
  }

  @MessagePattern('signup')
  register(@Payload() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @MessagePattern('signup-without-password')
  registerWithoutPassword(@Payload() dto: SignUpWithoutPasswordDto) {
    const password = this.passService.generate();

    return this.authService.signup({ ...dto, password });
  }

  @MessagePattern('signin')
  login(@Payload() dto: SignInDto) {
    return this.authService.signin(dto);
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
