import { Module } from '@nestjs/common';

import { ApiUser } from 'src/entity/ApiUser';
import { SignUpService } from './sign-up.service';
import { SignUpController } from './sign-up.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ApiUser]), UserModule],
  controllers: [SignUpController],
  providers: [SignUpService],
})
export class SignUpModule {}
