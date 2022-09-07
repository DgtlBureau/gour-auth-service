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
  findOne(@Payload('uuid') id: number) {
    return this.roleService.findOne(id);
  }

  @MessagePattern('create-role')
  create(@Payload() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @MessagePattern('update-role')
  update(@Payload('uuid') id: number, @Payload('dto') dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @MessagePattern('delete-role')
  remove(@Payload('uuid') id: number) {
    return this.roleService.remove(id);
  }
}
