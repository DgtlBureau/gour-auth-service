import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async send(dto: SendEmailDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${process.env.API_GATEWAY_URL}/messages/send-email`, dto),
    );

    if (!data) throw new InternalServerErrorException('Ошибка при отправке на почту');

    return data;
  }
}
