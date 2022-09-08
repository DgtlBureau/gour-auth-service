import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { Role } from 'src/entity/Role';
import { formatFields } from 'src/utils/formatFields';
import { AccessService } from '../access/access.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly accessService: AccessService,
  ) {}

  async create(dto: CreateRoleDto) {
    const fields: DeepPartial<Role> = formatFields<CreateRoleDto>(['key', 'description'], dto);

    if (dto.accessIds) {
      fields.accesses = [];

      for (const accessId of dto.accessIds) {
        fields.accesses.push(await this.accessService.findOne(accessId));
      }
    }

    try {
      return await this.roleRepository.save(fields);
    } catch (e) {
      throw new BadRequestException('Роль с таким ключем уже существует');
    }
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.roleRepository.findOneOrFail(id);
    } catch {
      throw new NotFoundException('Роль не найдена');
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    const candidate = await this.roleRepository.findOne(id);

    if (!candidate) {
      throw new NotFoundException('Роль не найдена');
    }

    const fields: DeepPartial<Role> = formatFields<UpdateRoleDto>(['key', 'description'], dto);

    if (dto.accessIds) {
      fields.accesses ??= [];

      for (const accessId of dto.accessIds) {
        fields.accesses.push(await this.accessService.findOne(accessId));
      }
    }

    return this.roleRepository.save({ id, ...fields });
  }

  async remove(id: number) {
    const { affected: deletedRows } = await this.roleRepository.delete(id);

    if (!deletedRows) {
      throw new BadRequestException('Роль не существует');
    }
    return {};
  }
}
