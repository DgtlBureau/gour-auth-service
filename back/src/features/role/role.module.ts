import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiRole } from 'src/entity/ApiRole';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiRole])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
