import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiAccess } from 'src/entity/ApiAccess';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly key: ApiAccess['key'];

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly description: ApiAccess['description'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  accessIds?: string[];
}
