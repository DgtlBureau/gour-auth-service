import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { ApiUser } from 'src/entity/ApiUser';

export class LoginUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @MaxLength(30)
  readonly login: ApiUser['login'];

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  readonly password: ApiUser['password'];
}
