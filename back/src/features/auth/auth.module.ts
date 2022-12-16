import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from 'src/common/services/email.service';
import { PasswordService } from 'src/common/services/password.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MESSAGES_SERVICE_HOST,
          port: +process.env.MESSAGES_SERVICE_PORT,
        },
      },
    ]),
    UserModule,
    RoleModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, EmailService, PasswordService],
})
export class AuthModule {}
