import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('apiAccess')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @MessagePattern('get-all-access')
  findAll() {
    return this.accessService.findAll();
  }

  @MessagePattern('get-one-access')
  findOne(@Payload('uuid') uuid: string) {
    return this.accessService.findOne(uuid);
  }

  @MessagePattern('create-access')
  create(@Payload() dto: CreateAccessDto) {
    return this.accessService.create(dto);
  }

  @MessagePattern('update-access')
  update(@Payload('uuid') uuid: string, @Payload('dto') dto: UpdateAccessDto) {
    return this.accessService.update(uuid, dto);
  }

  @MessagePattern('delete-access')
  remove(@Payload('uuid') uuid: string) {
    return this.accessService.remove(uuid);
  }
}
