import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { ApiRole } from 'src/entity/ApiRole';
import { formatFields } from 'src/utils/formatFields';
import { AccessService } from '../access/access.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(ApiRole)
    private roleRepository: Repository<ApiRole>,
    private readonly accessService: AccessService,
  ) {}

  async create(dto: CreateRoleDto) {
    const fields: DeepPartial<ApiRole> = formatFields<CreateRoleDto>(['key', 'description'], dto);

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

  async findOne(uuid: string) {
    try {
      return await this.roleRepository.findOneOrFail(uuid);
    } catch {
      throw new NotFoundException('Роль не найдена');
    }
  }

  async update(uuid: string, dto: UpdateRoleDto) {
    const candidate = await this.roleRepository.findOne(uuid);

    if (!candidate) {
      throw new NotFoundException('Роль не найдена');
    }

    const fields: DeepPartial<ApiRole> = formatFields<UpdateRoleDto>(['key', 'description'], dto);

    if (dto.accessIds) {
      fields.accesses ??= [];

      for (const accessId of dto.accessIds) {
        fields.accesses.push(await this.accessService.findOne(accessId));
      }
    }

    return await this.roleRepository.save({ uuid, ...fields });
  }

  async remove(uuid: string) {
    const { affected: deletedRows } = await this.roleRepository.delete(uuid);

    if (!deletedRows) {
      throw new BadRequestException('Роль не существует');
    }
    return {};
  }
}
