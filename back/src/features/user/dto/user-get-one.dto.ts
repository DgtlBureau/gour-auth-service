import { IsBooleanString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserGetOneDto {
  @IsBooleanString()
  @IsOptional()
  @ApiPropertyOptional()
  withPassword?: boolean;
}
