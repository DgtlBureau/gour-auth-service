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
  getUserById(@Payload('uuid') id: number) {
    return this.userService.getOneById(id);
  }

  @MessagePattern('create-user')
  create(@Payload() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @MessagePattern('update-user')
  updateOne(@Payload('uuid') id: number, @Payload('dto') userDto: UpdateUserDto) {
    return this.userService.updateOne(id, userDto);
  }

  @MessagePattern('delete-user')
  delete(@Payload('uuid') id: number) {
    return this.userService.deleteOne(id);
  }
}
