import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from 'src/common/services/email.service';
import { PasswordService } from 'src/common/services/password.service';

@Module({
  imports: [UserModule, RoleModule, HttpModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserService, EmailService, PasswordService],
})
export class AuthModule {}
