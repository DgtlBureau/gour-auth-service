import * as nodemailer from 'nodemailer';
import {SentMessageInfo} from "nodemailer/lib/smtp-transport";

export const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASSWORD,
    },
});

export interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const emailService = {
    sendVerificationMessage(email: string, token: string) {
      return this.sendMail({
          from: process.env.EMAIL_AUTH_USER,
          to: email,
          subject: 'Подтверждение почты Biotropica',
          text: '',
          html: `Для подтверждения почты перейдите по ссылке: <a target="_blank" href="${
              process.env.AUTH_SERVICE_URL
          }/confirmEmail?token=${token}">Подтвердить почту и войти</a>`,
      })
    },
    sendVerificationNoPassMessage(email: string, token: string, password: string) {
      return this.sendMail({
          from: process.env.EMAIL_AUTH_USER,
          to: email,
          subject: 'Подтверждение почты Biotropica',
          text: '',
          html: `Ваш email был зарегистрирован в сервисе Biotropica.<br>
Пароль для доступа в сервис: ${password}<br>
Для подтверждения почты перейдите по ссылке: <a target="_blank" href="${
              process.env.AUTH_SERVICE_URL
          }/confirmEmail?token=${token}">Подтвердить почту и войти</a>`,
      })
    },
    sendMail(
        options: EmailOptions,
    ): Promise<SentMessageInfo> {
        return new Promise(((resolve, reject) => {
            transporter.sendMail(options, ((err, info) => {
                if(err) {
                    return reject(err);
                }

                return resolve(info);
            }));
        }))
    },
    isEmail(str: string): boolean {
        return /\S+@\S+\.\S+/.test(str);
    }
}