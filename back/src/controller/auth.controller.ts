import { Body, Post, JsonController, HttpError, Ctx, CookieParam, CurrentUser, Patch, Get } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Context } from 'koa';

import { decodeToken, encodeJwt, encodeRefresh, verifyJwt, verifyRefresh } from '../services/jwt.service';
import { HttpStatus } from '../constants/http-status';
import { ApiUser } from '../entity/user.entity.';
import { ApiRole } from '../entity/role.entity';

@JsonController('auth')
export class AuthController {
  userRepository: Repository<ApiUser> = getManager().getRepository(ApiUser);

  @Post('/check-token')
  async checkToken(@Body() dto: { token: string }, @Ctx() ctx: Context) {
    return {
      result: verifyJwt(dto.token),
    };
  }

  @Post('/check-access')
  async checkAccess(
    @Body()
    dto: {
      token: string;
      accesses: string[];
    },
    @Ctx() ctx: Context
  ) {
    const token = dto.token || getToken(ctx);
    if (!verifyJwt(token)) {
      throw new HttpError(401, 'Bad credentials');
    }

    const decoded = decodeToken(token) as { accesses: string[] };

    return {
      result: dto.accesses.some(a => decoded.accesses.includes(a)),
    };
  }

  @Get('/current-user')
  async getCurrentUser(@Body() dto: { token: string }, @Ctx() ctx: Context) {
    const token = dto.token || getToken(ctx);
    if (!verifyJwt(token)) {
      throw new HttpError(401, 'Bad credentials');
    }

    return decodeToken(token);
  }

  @Post('/signin')
  async signin(@Body() dto: { email?: string; login?: string; password: string }, @Ctx() ctx: Context) {
    console.log('tut');

    const user = await this.userRepository.findOne({
      login: dto.login || dto.email,
    });

    if (user && user.isApproved && (await bcrypt.compare(dto.password, user.password))) {
      const accesses = AuthController.getAccessFromRoles(user.roles);
      return this.generateTokens(user, accesses, ctx);
    }

    if (!user) {
      console.error('User is not found');
    }

    if (!user.isApproved) {
      console.error('User is not approved');
    }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      console.error('Bad password');
    }

    throw new HttpError(401, 'Bad credentials');
  }

  @Post('/refresh')
  async refresh(@CookieParam('RefreshToken') refreshToken: string, @Ctx() ctx: Context) {
    const parsedRefresh = decodeToken(refreshToken) as {
      userUuid: string;
    };
    if (!parsedRefresh.userUuid) {
      throw new HttpError(401, 'Bad credentials');
    }

    const currentUser = await this.userRepository.findOne({
      uuid: parsedRefresh.userUuid,
    });

    if (!currentUser || !verifyRefresh(refreshToken)) {
      throw new HttpError(401, 'Bad credentials');
    }

    const accesses = AuthController.getAccessFromRoles(currentUser.roles);
    return this.generateTokens(currentUser, accesses, ctx);
  }

  @Post('/signout')
  async signout(@Ctx() ctx: Context) {
    ctx.cookies.set('AccessToken', undefined);
    ctx.cookies.set('RefreshToken', undefined);
    return {
      result: 'User was successfully logged out',
    };
  }

  @Patch('/change-password')
  async changePassword(
    @CurrentUser() user: ApiUser,
    @Body()
    dto: {
      currentPassword: string;
      password: string;
      verificationPassword: string;
    },
    @Ctx() ctx
  ) {
    const equalPassword = await bcrypt.compare(dto.currentPassword, user.password);
    if (!equalPassword) {
      throw new HttpError(400, 'Неверный запрос');
    }

    if (dto.password !== dto.verificationPassword) {
      throw new HttpError(400, 'Неверный запрос');
    }

    const hashPassword = await bcrypt.hash(dto.password, 5);
    await this.userRepository.update(user.uuid, {
      password: hashPassword,
    });
    const updatedUser = await this.userRepository.findOne(user.uuid);

    const accesses = AuthController.getAccessFromRoles(updatedUser.roles);
    return this.generateTokens(updatedUser, accesses, ctx);
  }

  generateTokens(user: Partial<ApiUser>, accesses: string[], ctx: Context) {
    const token = encodeJwt({
      uuid: user.uuid,
      login: user.login,
      accesses,
    });
    const refreshToken = encodeRefresh({
      refreshToken: 'true',
      userUuid: user.uuid,
    });
    ctx.cookies.set('AccessToken', token, {
      maxAge: 4 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      // sameSite: 'none'
    });
    ctx.cookies.set('RefreshToken', refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      // secure: true,
      path: '/api/auth/refresh',
      // sameSite: 'none'
    });
    return {
      token,
      refreshToken,
    };
  }

  private static checkPasswordsMatch(password: string, verificationPassword: string) {
    if (verificationPassword !== password) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Пароли не совпадают');
    }
  }

  static getAccessFromRoles(roles: ApiRole[]) {
    // TODO: Сделать возможность расширяемости
    const accesses: string[] = [];
    for (const role of roles) {
      accesses.push(...role.accesses.map(it => it.key));
      if (role.extends?.length) {
        accesses.push(...this.getAccessFromRoles(role.extends));
      }
    }

    return accesses;
  }
}

function getToken(context: Context): string {
  let accessToken = context.cookies.get('AccessToken');
  if (!accessToken) {
    const authorization = context.headers.authorization;
    if (!authorization) {
      return '';
    }
    accessToken = authorization.split(' ')[1];
  }

  return accessToken;
}
