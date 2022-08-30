import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ApiRole } from 'src/entity/ApiRole';
import { ApiUser } from 'src/entity/ApiUser';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('apiUsers')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @MessagePattern('get-users-by-roles')
  getAllByRoles(@Query('roles') roles: ApiRole[] = []) {
    return this.userService.getAllByRoles(roles);
  }

  @Get(':uuid')
  @MessagePattern('get-user-by-id')
  getUserByUuid(@Param() id: string) {
    return this.userService.getOneByUuid(id);
  }

  @Post()
  @MessagePattern('create-user')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Put('/:uuid')
  @MessagePattern('update-user')
  updateOne(@Param() uuid: string, @Body() userDto: UpdateUserDto) {
    return this.userService.updateOne(uuid, userDto);
  }

  @Delete('/:uuid')
  @MessagePattern('delete-user')
  delete(@Param() uuid: string) {
    return this.userService.deleteOne(uuid);
  }
}
