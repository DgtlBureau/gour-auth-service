import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Access } from 'src/entity/Access';
import { formatFields } from 'src/utils/formatFields';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private accessRepository: Repository<Access>,
  ) {}

  async create(dto: CreateAccessDto) {
    const { key, description } = dto;

    try {
      return await this.accessRepository.save({ key, description });
    } catch {
      throw new BadRequestException('Доступ с таким ключом уже существует');
    }
  }

  findAll() {
    return this.accessRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.accessRepository.findOneOrFail(id);
    } catch {
      throw new NotFoundException('Доступ не найден');
    }
  }

  async update(id: number, dto: UpdateAccessDto) {
    const candidate = await this.accessRepository.findOne(id);

    if (!candidate) throw new NotFoundException('Доступ не найден');

    const fields = formatFields<UpdateAccessDto>(['key', 'description'], dto);

    return this.accessRepository.save({ id, ...fields });
  }

  async remove(id: number) {
    const { affected: deletedRows } = await this.accessRepository.delete(id);

    if (!deletedRows) throw new BadRequestException(`Доступ с id ${id} не существует`);

    return deletedRows;
  }
}
