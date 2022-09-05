import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiRole } from 'src/entity/ApiRole';
import { ApiUser } from 'src/entity/ApiUser';
import { RoleModule } from '../role/role.module';
import { UserController } from './user.controller';
import { RoleService } from '../role/role.service';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiUser, ApiRole]), UserModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, RoleService],
  exports: [UserService],
})
export class UserModule {}
