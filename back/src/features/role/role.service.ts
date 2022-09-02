import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiRole } from 'src/entity/ApiRole';
import { formatFields } from 'src/utils/formatFields';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(ApiRole)
    private roleRepository: Repository<ApiRole>,
  ) {}

  async create(dto: CreateRoleDto) {
    const { key, description } = dto;

    try {
      return await this.roleRepository.save({ key, description });
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
    const fields = formatFields<UpdateRoleDto>(['key', 'description'], dto);

    const { affected: updatedRows } = await this.roleRepository.update(uuid, fields);

    if (!updatedRows) {
      throw new NotFoundException('Роль не найден');
    }
  }

  async remove(uuid: string) {
    const { affected: deletedRows } = await this.roleRepository.delete(uuid);

    if (!deletedRows) {
      throw new BadRequestException('Роль не существует');
    }
  }
}
