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
import {decodeToken, encodeVerificationToken, verifyVerificationToken} from "../services/jwtService";
import {Context} from "koa";
import {HttpStatus} from "../constants/HttpStatus";
import * as bcrypt from "bcryptjs";
import {emailService} from "../services/emailService";
import {ApiUser} from "../entity/ApiUser";

@JsonController()
export class SignupController {
    userRepository: Repository<ApiUser> = getManager().getRepository(ApiUser);

    @Post('/signup')
    async signup (
        @Body() dto: { login: string; password: string },
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

            const hashPassword = await bcrypt.hash(dto.password, 5)

            const user = await this.userRepository.save({
                ...dto,
                password: hashPassword
            })

            const payload = {
                id: user.id,
                login: user.login,
                referer
            }

            if (emailService.isEmail(user.login)) {
                const verificationToken = encodeVerificationToken(payload);
                await emailService.sendVerificationMessage(user.login, verificationToken);
                return {
                    result: 'Verification email was successfully sent',
                    apiUser: user
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
            id: number;
            referer: string;
        };
        await this.userRepository.update(parsed.id, {
            isApproved: true,
        });

        response.redirect(parsed.referer);

        return response;
    }
}