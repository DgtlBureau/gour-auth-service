import { Param, Body, Get, Post, Put, Delete, JsonController, Authorized } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';

import { Role } from '../entity/role.entity';

@Authorized('ROLE_CRUD')
@JsonController('roles')
export class RoleController {
  roleRepository: Repository<Role> = getManager().getRepository(Role);

  @Get('/')
  getAll() {
    return this.roleRepository.find();
  }

  @Get('/:uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.roleRepository.findOne({ uuid });
  }

  @Post('/')
  post(@Body() dto: Partial<Role>) {
    return this.roleRepository.save(dto);
  }

  @Put('/:uuid')
  put(@Param('uuid') uuid: string, @Body() dto: Partial<Role>) {
    return this.roleRepository.save({
      uuid,
      ...dto,
    });
  }

  @Delete('/:uuid')
  remove(@Param('uuid') uuid: string) {
    return this.roleRepository.delete(uuid);
  }
}
