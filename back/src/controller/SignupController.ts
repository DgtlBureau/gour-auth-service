import {
    Param,
    Body,
    Get,
    Post,
    Put,
    Delete,
    JsonController,
    Authorized, QueryParam, Res, HttpError, Ctx, Header, HeaderParam,
} from 'routing-controllers';
import {getManager, Repository} from "typeorm";
import {
    decodeRoleKey,
    decodeToken,
    encodeJwt,
    encodeVerificationToken,
    verifyVerificationToken
} from "../services/jwtService";
import {Context} from "koa";
import {HttpStatus} from "../constants/HttpStatus";
import * as bcrypt from "bcryptjs";
import {emailService} from "../services/emailService";
import {ApiUser} from "../entity/ApiUser";
import {AuthController} from "./AuthController";
import {ApiRole} from "../entity/ApiRole";
import { AES, enc } from 'crypto-js';

@JsonController()
export class SignupController {
    userRepository: Repository<ApiUser> = getManager().getRepository(ApiUser);
    roleRepository: Repository<ApiRole> = getManager().getRepository(ApiRole);

    @Post('/signup')
    async signup (
        @Body() dto: {
            login: string;
            password: string;
            role?: string;
        },
        @Ctx() ctx: Context,
        @HeaderParam('referer') referer: string,
    ) {
            const candidate = await this.userRepository.findOne({
                login: dto.login
            })

            if (candidate) {
                throw new HttpError(
                    HttpStatus.BAD_REQUEST,
                    'login:Пользователь с таким login существует'
                )
            }


            let role: ApiRole|undefined;
        if(dto.role) {
            const decodedRoleKey = decodeRoleKey(dto.role);
            if(decodedRoleKey) {
                role = await this.roleRepository.findOne({
                    key: decodedRoleKey
                })
            }
        }

            const hashPassword = await bcrypt.hash(dto.password, 5);
            const unconfirmedRole = await this.roleRepository.findOne({
                key: 'UNCONFIRMED_USER'
            });

            if(!unconfirmedRole) {
                throw new HttpError(400, 'Role UNCONFIRMED_USER doest exists')
            }

            const user = await this.userRepository.save({
                ...dto,
                password: hashPassword,
                roles: [
                    unconfirmedRole
                ]
            })

            const payload = {
                uuid: user.uuid,
                login: user.login,
                referer,
                role,
            }
        console.log('payload', payload);

            if (emailService.isEmail(user.login)) {
                const verificationToken = encodeVerificationToken(payload);
                await emailService.sendVerificationMessage(user.login, verificationToken);
                const accesses = AuthController.getAccessFromRoles([unconfirmedRole])
                const token = encodeJwt({
                    uuid: user.uuid,
                    login: user.login,
                    accesses,
                })
                ctx.cookies.set('AccessToken', token, {
                    httpOnly: true,
                })

                return {
                    result: 'Verification email was successfully sent',
                    apiUser: user,
                    token,
                }
            } else {
                throw new HttpError(400, 'Login must be type of email')
            }
    }


    @Get('/confirmEmail')
    async confirmEmail(
        @QueryParam('token') token: string,
        @Res() response: any
    ) {
        if(!verifyVerificationToken(token)) {
            throw new HttpError(401, 'Bad credentials')
        }
        const parsed = decodeToken(token) as {
            uuid: string;
            referer: string;
            role?: ApiRole;
        };
        const updatedRole: Partial<ApiUser> = {
            uuid: parsed.uuid,
            isApproved: true,
        }

        if(parsed.role) {
            updatedRole.roles = [await this.roleRepository.findOne(parsed.role.uuid)]
        }
        console.log('PARSED', parsed);
        await this.userRepository.save(updatedRole);

        response.redirect(parsed.referer);

        return response;
    }
}