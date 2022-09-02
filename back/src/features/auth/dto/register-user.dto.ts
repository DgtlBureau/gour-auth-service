import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiUser } from 'src/entity/ApiUser';

export class RegisterUserDto {
  @ApiProperty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(30)
  readonly login: ApiUser['login'];

  @ApiProperty({ example: 'alex_track' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: ApiUser['name'];

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  readonly password: ApiUser['password'];
}
