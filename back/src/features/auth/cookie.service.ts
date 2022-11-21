import { Injectable } from '@nestjs/common';
import { CookieOptions, Response, Request } from 'express';

@Injectable()
export class CookieService {
  ACCESS_TOKEN_NAME = 'AccessToken';
  REFRESH_TOKEN_NAME = 'RefreshToken';
  sameSite: CookieOptions['sameSite'] = process.env.NODE_ENV === 'production' ? 'lax' : 'none';

  get NEW_DATE() {
    return new Date();
  }
  get MAX_AGE_15_MIN() {
    return new Date(this.NEW_DATE.setMinutes(this.NEW_DATE.getMinutes() + 15));
  }
  get MAX_AGE_1_DAY() {
    return new Date(this.NEW_DATE.setDate(this.NEW_DATE.getDate() + 1));
  }
  get MAX_AGE_30_DAYS() {
    return new Date(this.NEW_DATE.setMinutes(this.NEW_DATE.getDay() + 30));
  }

  get accessTokenOptions() {
    return {
      httpOnly: true,
      secure: true,
      expires: this.MAX_AGE_1_DAY,
      sameSite: this.sameSite,
    };
  }

  get refreshTokenOptions() {
    return {
      httpOnly: true,
      secure: true,
      path: '/client-auth/refresh',
      expires: this.MAX_AGE_30_DAYS,
      sameSite: this.sameSite,
    };
  }

  setAccessToken(res: Response, token: string) {
    res.cookie(this.ACCESS_TOKEN_NAME, token, this.accessTokenOptions);
  }

  setRefreshToken(res: Response, token: string) {
    res.cookie(this.REFRESH_TOKEN_NAME, token, this.refreshTokenOptions);
  }

  clearAllTokens(res: Response) {
    res.clearCookie(this.ACCESS_TOKEN_NAME, this.accessTokenOptions);
    res.clearCookie(this.REFRESH_TOKEN_NAME, this.refreshTokenOptions);
  }
}

export function getToken(req: Request): string | undefined {
  const header = req.header('Authorization');
  if (header) {
    return header.replace('Bearer ', '');
  }

  return req.cookies['AccessToken'];
}
