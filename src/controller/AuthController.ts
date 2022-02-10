import {
    Body,
    Post,
    JsonController,
    HttpError,
    Ctx, CookieParam, CurrentUser, Patch, Get, QueryParam, Redirect, Res
} from 'routing-controllers'
import { getManager, Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Context } from 'koa'
import {
    decodeToken,
    encodeJwt,
    encodeRefresh,
    encodeVerificationToken,
    verifyJwt,
    verifyRefresh, verifyVerificationToken
} from '../services/jwtService'
import { HttpStatus } from '../constants/HttpStatus'
import { ApiUser } from "../entity/ApiUser";
import {ApiRole} from "../entity/ApiRole";
import {emailService} from "../services/emailService";

@JsonController()
export class AuthController {
    userRepository: Repository<ApiUser> = getManager().getRepository(ApiUser);

    @Post('/checkToken')
    async checkToken (@Body() body: { token: string; }, @Ctx() ctx: Context) {
        return {
            result: verifyJwt(body.token),
        };
    }

    @Post('/checkAccess')
    async checkAccess (@Body() body: {
        token: string;
        accesses: string[];
        }, @Ctx() ctx: Context) {
        const token = body.token || getToken(ctx);
        if(!verifyJwt(token)) {
            throw new HttpError(401, 'Bad credentials')
        }

        const decoded = decodeToken(token) as {accesses: string[]}

        return {
            result: body.accesses.some(a => decoded.accesses.includes(a))
        };
    }

    @Get('/currentUser')
    async getCurrentUser (
        @Body() body: { token: string; },
        @Ctx() ctx: Context
    ) {
        const token = body.token || getToken(ctx);
        if(!verifyJwt(token)) {
            throw new HttpError(401, 'Bad credentials')
        }

        return decodeToken(token);
    }

    @Post('/signin')
    async signin (@Body() credentials: { email?: string; login?: string; password: string }, @Ctx() ctx: Context) {
        const user = await this.userRepository.findOne({
            login: credentials.login || credentials.email
        })


        if (user && user.isApproved && await bcrypt.compare(credentials.password, user.password)) {
            const accesses = AuthController.getAccessFromRoles(user.roles)
            return this.generateTokens(user, accesses, ctx)
        }

        if(!user) {
            console.error('User is not found')
        }

        if(!user.isApproved) {
            console.error('User is not approved')
        }

        if(!(await bcrypt.compare(credentials.password, user.password))) {
            console.error('Bad password')
        }

        throw new HttpError(401, 'Bad credentials')
    }

    @Post('/refresh')
    async refresh (
        @CookieParam('refreshToken') refreshToken: string,
        @Ctx() ctx: Context
    ) {
        const parsedRefresh = decodeToken(refreshToken) as {
            userUuid: string
        }
        if (!parsedRefresh.userUuid) {
            throw new HttpError(401, 'Bad credentials')
        }

        const currentApiUser = await this.userRepository.findOne({
            uuid: parsedRefresh.userUuid
        })

        if (!currentApiUser || !verifyRefresh(refreshToken)) {
            throw new HttpError(401, 'Bad credentials')
        }

        const accesses = AuthController.getAccessFromRoles(currentApiUser.roles)
        return this.generateTokens(currentApiUser, accesses, ctx)
    }

    @Post('/signout')
    async signout (@Ctx() ctx: Context) {
        ctx.cookies.set('AccessToken', undefined)
        ctx.cookies.set('RefreshToken', undefined)
        return {
            result: 'ApiUser was successfully logged out'
        }
    }

    @Patch('/change-password')
    async changePassword (@CurrentUser() user: ApiUser, @Body() changePasswordDto: {
        currentPassword: string;
        password: string;
        verificationPassword: string;
    }, @Ctx() ctx) {
        const equalPassword = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password
        )
        if (!equalPassword) {
            throw new HttpError(400, 'Неверный запрос')
        }

        if (changePasswordDto.password !== changePasswordDto.verificationPassword) {
            throw new HttpError(400, 'Неверный запрос')
        }

        const hashPassword = await bcrypt.hash(changePasswordDto.password, 5)
        await this.userRepository.update(user.uuid, {
            password: hashPassword
        })
        const updatedApiUser = await this.userRepository.findOne(user.uuid)

        const accesses = AuthController.getAccessFromRoles(updatedApiUser.roles)
        return this.generateTokens(updatedApiUser, accesses, ctx)
    }

    generateTokens (user: Partial<ApiUser>, accesses: string[], ctx: Context) {
        const token = encodeJwt({
            uuid: user.uuid,
            login: user.login,
            accesses,
        })
        const refreshToken = encodeRefresh({
            refreshToken: 'true',
            userUuid: user.uuid
        })
        ctx.cookies.set('AccessToken', token, {
            maxAge: 4 * 60 * 60 * 1000,
            httpOnly: true,
            // secure: true,
            // sameSite: 'none'
        })
        ctx.cookies.set('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            // secure: true,
            path: '/api/auth/refresh',
            // sameSite: 'none'
        })
        return {
            token,
            refreshToken
        }
    }

    private static checkPasswordsMatch (password: string, verificationPassword: string) {
        if (verificationPassword !== password) {
            throw new HttpError(HttpStatus.BAD_REQUEST, 'Пароли не совпадают')
        }
    }

    private static getAccessFromRoles(roles: ApiRole[]) {
        // TODO: Сделать возможность расширяемости
        const accesses: string[] = [];
        for(const role of roles) {
            accesses.push(...role.accesses.map(it => it.key))
            if(role.extends?.length) {
                accesses.push(...this.getAccessFromRoles(role.extends))
            }
        }

        return accesses;
    }
}

function getToken(context: Context): string {
    let accessToken = context.cookies.get('AccessToken');
    if(!accessToken) {
        const authorization = context.headers.authorization;
        if(!authorization) {
            return '';
        }
        accessToken = authorization.split(' ')[1];
    }

    return accessToken
}