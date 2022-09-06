import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('apiRoles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern('get-roles')
  findAll() {
    return this.roleService.findAll();
  }

  @MessagePattern('get-role')
  findOne(@Payload('uuid') uuid: string) {
    return this.roleService.findOne(uuid);
  }

  @MessagePattern('create-role')
  create(@Payload() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @MessagePattern('update-role')
  update(@Payload('uuid') uuid: string, @Payload('dto') dto: UpdateRoleDto) {
    return this.roleService.update(uuid, dto);
  }

  @MessagePattern('delete-role')
  remove(@Payload('uuid') uuid: string) {
    return this.roleService.remove(uuid);
  }
}
