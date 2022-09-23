import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Access } from 'src/entity/Access';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly key: Access['key'];

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly description: Access['description'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  accessIds?: number[];
}
