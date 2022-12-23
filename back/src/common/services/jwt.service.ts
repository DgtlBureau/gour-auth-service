import * as jwt from 'jsonwebtoken';
import { instanceToPlain } from 'class-transformer';

export function encodeJwt(obj: object, accessSecret: string) {
  return jwt.sign(instanceToPlain(obj), accessSecret, {
    expiresIn: '15m',
  });
}

export function encodeRefreshJwt(obj: object, refreshSecret: string) {
  return jwt.sign(instanceToPlain(obj), refreshSecret, {
    expiresIn: '30d',
  });
}

export const verifyAccessJwt = (token: string, accessSecret: string) => verifyJwt(token, accessSecret);
export const verifyRefreshJwt = (token: string, refreshSecret: string) => verifyJwt(token, refreshSecret);

function verifyJwt(token: string, secretKey: string): boolean {
  try {
    jwt.verify(token, secretKey);
    return true;
  } catch (e) {
    return false;
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}
