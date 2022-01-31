import jwt from 'jsonwebtoken';
import {ApiUser} from "../entity/ApiUser";

const SECRET = process.env.ACCESS_TOKEN_SECRET;
const SECRET_REFRESH = process.env.REFRESH_TOKEN_SECRET;

export function encodeJwt(obj: object) {
    return jwt.sign(obj, SECRET);
}

export function encodeUnlimitedJwt() {
    return jwt.sign({test: true}, SECRET);
}

export function encodeRefresh(obj: object) {
    return jwt.sign(obj, SECRET_REFRESH, {
        expiresIn: '30d'
    });
}

export function verifyJwt(token: string): boolean {
    try {
        jwt.verify(token, SECRET);
        return true;
    } catch (e) {
        return false
    }
}

export function verifyRefresh(token) {
    try {
        jwt.verify(token, SECRET_REFRESH);
        return true;
    } catch (e) {
        return false
    }
}

export function decodeToken(token: string) {
    return jwt.decode(token);
}