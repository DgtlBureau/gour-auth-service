import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiAccess } from 'src/entity/ApiAccess';

export class UpdateRoleDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly key: ApiAccess['key'];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly description: ApiAccess['description'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  accessIds?: string[];
}
