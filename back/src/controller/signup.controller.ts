import { Body, Get, Post, JsonController, QueryParam, Res, HttpError, Ctx, HeaderParam } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';
import generatePassword from 'generate-password';
import { Context } from 'koa';
import * as bcrypt from 'bcryptjs';

import {
  decodeRoleKey,
  decodeToken,
  encodeJwt,
  encodeVerificationToken,
  verifyVerificationToken,
} from '../services/jwt.service';
import { HttpStatus } from '../constants/http-status';
import { emailService } from '../services/email.service';
import { User } from '../entity/user.entity.';
import { AuthController } from './auth.controller';
import { Role } from '../entity/role.entity';

@JsonController('auth')
export class SignupController {
  userRepository: Repository<User> = getManager().getRepository(User);
  roleRepository: Repository<Role> = getManager().getRepository(Role);

  @Post('/signup')
  async signup(
    @Body()
    dto: {
      login: string;
      password: string;
      role?: string;
    },
    @Ctx() ctx: Context,
    @HeaderParam('referer') referer: string
  ) {
    const candidate = await this.userRepository.findOne({
      login: dto.login,
    });

    if (candidate) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'login:Пользователь с таким login существует');
    }

    let role: Role | undefined;
    if (dto.role) {
      const decodedRoleKey = decodeRoleKey(dto.role);
      if (decodedRoleKey) {
        role = await this.roleRepository.findOne({
          key: decodedRoleKey,
        });
      }
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    const unconfirmedRole = await this.roleRepository.findOne({
      key: 'UNCONFIRMED_USER',
    });

    if (!unconfirmedRole) {
      throw new HttpError(400, 'Role UNCONFIRMED_USER doest exists');
    }

    const user = await this.userRepository.save({
      ...dto,
      password: hashPassword,
      roles: [unconfirmedRole],
    });

    const payload = {
      uuid: user.uuid,
      login: user.login,
      referer,
      role,
    };
    console.log('payload', payload);

    if (emailService.isEmail(user.login)) {
      const verificationToken = encodeVerificationToken(payload);
      await emailService.sendVerificationMessage(user.login, verificationToken);
      const accesses = AuthController.getAccessFromRoles([unconfirmedRole]);
      const token = encodeJwt({
        uuid: user.uuid,
        login: user.login,
        accesses,
      });
      ctx.cookies.set('AccessToken', token, {
        httpOnly: true,
      });

      return {
        result: 'Verification email was successfully sent',
        apiUser: user,
        token,
      };
    } else {
      throw new HttpError(400, 'Login must be type of email');
    }
  }

  @Post('/without-password')
  async signupWithoutPassword(
    @Body()
    dto: {
      email: string;
      role?: string;
    },
    @Ctx() ctx: Context,
    @HeaderParam('referer') referer: string
  ) {
    const candidate = await this.userRepository.findOne({
      login: dto.email,
    });

    if (candidate) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'email:Пользователь с таким email существует');
    }

    let role: Role | undefined;
    if (dto.role) {
      const decodedRoleKey = decodeRoleKey(dto.role);
      if (decodedRoleKey) {
        role = await this.roleRepository.findOne({
          key: decodedRoleKey,
        });
      }
    }

    const password = generatePassword.generate();

    const hashPassword = await bcrypt.hash(password, 5);
    const unconfirmedRole = await this.roleRepository.findOne({
      key: 'UNCONFIRMED_USER',
    });

    if (!unconfirmedRole) {
      throw new HttpError(400, 'Role UNCONFIRMED_USER doest exists');
    }

    const user = await this.userRepository.save({
      login: dto.email,
      password: hashPassword,
      roles: [unconfirmedRole],
    });

    const payload = {
      uuid: user.uuid,
      login: user.login,
      referer,
      role,
    };

    if (emailService.isEmail(user.login)) {
      const verificationToken = encodeVerificationToken(payload);
      await emailService.sendVerificationNoPassMessage(user.login, verificationToken, password);
      const accesses = AuthController.getAccessFromRoles([unconfirmedRole]);
      const token = encodeJwt({
        uuid: user.uuid,
        login: user.login,
        accesses,
      });
      ctx.cookies.set('AccessToken', token, {
        httpOnly: true,
      });

      return {
        result: 'Verification email was successfully sent',
        user,
        token,
      };
    } else {
      throw new HttpError(400, 'Login must be type of email');
    }
  }

  @Get('/confirm-email')
  async confirmEmail(@QueryParam('token') token: string, @Res() response: any) {
    if (!verifyVerificationToken(token)) {
      throw new HttpError(401, 'Bad credentials');
    }
    const parsed = decodeToken(token) as {
      uuid: string;
      referer: string;
      role?: Role;
    };
    const updatedRole: Partial<User> = {
      uuid: parsed.uuid,
      isApproved: true,
    };

    if (parsed.role) {
      updatedRole.roles = [await this.roleRepository.findOne(parsed.role.uuid)];
    }
    console.log('PARSED', parsed);
    await this.userRepository.save(updatedRole);

    response.redirect(parsed.referer);

    return response;
  }
}
