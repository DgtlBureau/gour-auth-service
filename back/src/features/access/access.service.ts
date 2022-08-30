import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApiAccess } from 'src/entity/ApiAccess';
import { formatFields } from 'src/utils/formatFields';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(ApiAccess)
    private accessRepository: Repository<ApiAccess>,
  ) {}

  async create(dto: CreateAccessDto) {
    const { key, description } = dto;

    try {
      return await this.accessRepository.save({ key, description });
    } catch {
      throw new BadRequestException('Доступ с таким ключем уже существует');
    }
  }

  findAll() {
    return this.accessRepository.find();
  }

  async findOne(uuid: string) {
    try {
      return await this.accessRepository.findOneOrFail(uuid);
    } catch {
      throw new NotFoundException('Доступ не найден');
    }
  }

  async update(uuid: string, dto: UpdateAccessDto) {
    try {
      const fields = formatFields<UpdateAccessDto>(['key', 'description'], dto);

      return await this.accessRepository.update(uuid, fields);
    } catch {
      throw new NotFoundException('Доступ не найден');
    }
  }

  async remove(uuid: string) {
    const { affected: deletedColumns } = await this.accessRepository.delete(
      uuid,
    );

    if (!deletedColumns) {
      throw new BadRequestException(`Доступ с id ${uuid} не существует`);
    }
  }
}
