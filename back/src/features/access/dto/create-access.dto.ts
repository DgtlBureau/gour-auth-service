import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Access } from 'src/entity/Access';

export class CreateAccessDto {
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
}
