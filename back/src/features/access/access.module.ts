import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiAccess } from 'src/entity/ApiAccess';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiAccess])],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
