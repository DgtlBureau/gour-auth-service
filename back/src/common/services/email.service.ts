import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SendEmailDto } from '../dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(@Inject('MESSAGES_SERVICE') private client: ClientProxy) {}

  async send(dto: SendEmailDto) {
    return firstValueFrom(this.client.send('send-email', dto));
  }
}
