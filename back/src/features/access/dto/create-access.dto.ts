import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiAccess } from 'src/entity/ApiAccess';

export class CreateAccessDto {
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
}
