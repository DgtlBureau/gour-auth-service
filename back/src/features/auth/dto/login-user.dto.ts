import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { User } from 'src/entity/User';

export class LoginUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @MaxLength(30)
  readonly email: User['login'];

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  readonly password: User['password'];
}
