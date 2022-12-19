import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from 'src/common/services/email.service';
import { PasswordService } from 'src/common/services/password.service';

import { User } from 'src/entity/User';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RoleModule, HttpModule.register({})],
  controllers: [UserController],
  providers: [UserService, PasswordService, EmailService],
  exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
