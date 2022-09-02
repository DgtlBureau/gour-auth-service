import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, CookieService],
  exports: [AuthService],
})
export class AuthModule {}
