import { Param, Body, Get, Post, Put, Delete, JsonController, Authorized } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';

import { ApiAccess } from '../entity/access.entity';

@Authorized('API_ACCESS_CRUD')
@JsonController('access')
export class AccessController {
  accessRepository: Repository<ApiAccess> = getManager().getRepository(ApiAccess);

  @Get('/')
  getAll() {
    return this.accessRepository.find();
  }

  @Get('/:uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.accessRepository.findOne({ uuid });
  }

  @Post('/')
  post(@Body() dto: Partial<ApiAccess>) {
    return this.accessRepository.save(dto);
  }

  @Put('/:uuid')
  put(@Param('uuid') uuid: string, @Body() dto: Partial<ApiAccess>) {
    return this.accessRepository.update(uuid, dto);
  }

  @Delete('/:uuid')
  remove(@Param('uuid') uuid: string) {
    return this.accessRepository.delete(uuid);
  }
}
