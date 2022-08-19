import { Param, Body, Get, Post, Put, Delete, JsonController, Authorized, QueryParam } from 'routing-controllers';
import { getManager, Repository } from 'typeorm';

import { User } from '../entity/user.entity.';

@Authorized('USER_CRUD')
@JsonController('users')
export class UserController {
  userRepository: Repository<User> = getManager().getRepository(User);

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
  post(@Body() User: Partial<User>) {
    return this.userRepository.save(User);
  }

  @Put('/:uuid')
  put(@Param('uuid') uuid: string, @Body() User: Partial<User>) {
    return this.userRepository.save({
      ...User,
      uuid,
    });
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.userRepository.delete(id);
  }
}
