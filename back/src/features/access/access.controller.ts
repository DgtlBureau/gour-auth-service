import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Controller('apiAccess')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  findAll() {
    return this.accessService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.accessService.findOne(uuid);
  }

  @Post()
  create(@Body() dto: CreateAccessDto) {
    return this.accessService.create(dto);
  }

  @Put(':uuid')
  update(@Param('uuid') uuid: string, @Body() dto: UpdateAccessDto) {
    return this.accessService.update(uuid, dto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.accessService.remove(uuid);
  }
}
