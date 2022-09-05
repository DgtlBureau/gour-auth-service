import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ApiRole } from 'src/entity/ApiRole';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('apiUsers')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('get-users-by-roles')
  getAllByRoles(@Payload() roles: ApiRole[] = []) {
    return this.userService.getAllByRoles(roles);
  }

  @MessagePattern('get-user-by-id')
  getUserByUuid(@Payload('uuid') id: string) {
    return this.userService.getOneByUuid(id);
  }

  @MessagePattern('create-user')
  create(@Payload() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @MessagePattern('update-user')
  updateOne(@Payload('uuid') uuid: string, @Payload('dto') userDto: UpdateUserDto) {
    return this.userService.updateOne(uuid, userDto);
  }

  @MessagePattern('delete-user')
  delete(@Payload('uuid') uuid: string) {
    return this.userService.deleteOne(uuid);
  }
}
