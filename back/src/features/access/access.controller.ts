import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @MessagePattern('get-accesses')
  findAll() {
    return this.accessService.findAll();
  }

  @MessagePattern('get-access')
  findOne(@Payload() id: number) {
    return this.accessService.findOne(id);
  }

  @MessagePattern('create-access')
  create(@Payload() dto: CreateAccessDto) {
    return this.accessService.create(dto);
  }

  @MessagePattern('update-access')
  update(@Payload('id') id: number, @Payload('dto') dto: UpdateAccessDto) {
    return this.accessService.update(id, dto);
  }

  @MessagePattern('delete-access')
  remove(@Payload() id: number) {
    return this.accessService.remove(id);
  }
}
