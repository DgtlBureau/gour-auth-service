import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Access } from 'src/entity/Access';

export class UpdateAccessDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly key: Access['key'];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly description: Access['description'];
}
