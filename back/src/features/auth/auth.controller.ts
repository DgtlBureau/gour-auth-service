import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import generatePassword from 'generate-password';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterWithoutPasswordUserDto } from './dto/register-user-without-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signup')
  register(@Payload() userDto: RegisterWithoutPasswordUserDto) {
    const password = generatePassword.generate();
    return this.authService.register({ ...userDto, password });
  }

  @MessagePattern('signup-without-password')
  registerWithoutPassword(@Payload() userDto: RegisterUserDto) {
    return this.authService.register(userDto);
  }

  @MessagePattern('signin')
  login(@Payload() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @MessagePattern('refresh')
  refresh(@Payload() oldRefreshToken: string) {
    return this.authService.refresh(oldRefreshToken);
  }
}
