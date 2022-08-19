import { Param, Body, Get, Post, Put, Delete, JsonController, Authorized, QueryParam } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';

import { ApiUser } from '../entity/user.entity.';

@Authorized('API_USER_CRUD')
@JsonController('users')
export class UserController {
  userRepository: Repository<ApiUser> = getManager().getRepository(ApiUser);

  @Get('/')
  async getAll(@QueryParam('roles', { parse: true }) roles: string[] = []) {
    if (roles.length) {
      return (await this.userRepository.find()).filter(it => it.roles.some(role => roles.includes(role.key)));
    }
    return this.userRepository.find();
  }

  @Get('/:uuid')
  getOne(@Param('uuid') uuid: string) {
    return this.userRepository.findOne({ uuid });
  }

  @Post('/')
  post(@Body() dto: Partial<ApiUser>) {
    return this.userRepository.save(dto);
  }

  @Put('/:uuid')
  put(@Param('uuid') uuid: string, @Body() dto: Partial<ApiUser>) {
    return this.userRepository.save({
      ...dto,
      uuid,
    });
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.userRepository.delete(id);
  }
}
