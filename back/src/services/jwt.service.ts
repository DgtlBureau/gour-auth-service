import jwt from 'jsonwebtoken';
import { AES, enc } from 'crypto-js';

const SECRET = process.env.ACCESS_TOKEN_SECRET;
const SECRET_REFRESH = process.env.REFRESH_TOKEN_SECRET;

export function encodeJwt(obj: object) {
  return jwt.sign(obj, SECRET, {
    expiresIn: '3m',
  });
}

export function encodeVerificationToken(obj: object) {
  return jwt.sign(obj, SECRET + SECRET_REFRESH);
}

export function verifyVerificationToken(token: string) {
  return jwt.verify(token, SECRET + SECRET_REFRESH);
}

export function encodeUnlimitedJwt() {
  return jwt.sign({ test: true }, SECRET);
}

export function encodeRefresh(obj: object) {
  return jwt.sign(obj, SECRET_REFRESH, {
    expiresIn: '30d',
  });
}

export function verifyJwt(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

export function verifyRefresh(token) {
  try {
    jwt.verify(token, SECRET_REFRESH);
    return true;
  } catch (e) {
    return false;
  }
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}

const HASH_SEPARATOR = '___';

export function decodeRoleKey(hash: string): string | null {
  const bytes = AES.decrypt(hash, process.env.ROLE_SECRET_KEY);
  const result = bytes.toString(enc.Utf8);
  if (!result) {
    return null;
  }
  const [prefix, roleUuid, roleKey] = result.split(HASH_SEPARATOR);
  return roleKey;
}

export function encodeRoleKey(roleUuid: string, roleKey: string): string {
  return AES.encrypt(
    `ROLE${HASH_SEPARATOR}${roleUuid}${HASH_SEPARATOR}${roleKey}`,
    process.env.ROLE_SECRET_KEY
  ).toString();
}
