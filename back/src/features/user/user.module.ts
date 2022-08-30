import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiUser } from 'src/entity/ApiUser';
import { UserController } from './user.controller'
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiUser]), UserModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
