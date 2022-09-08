import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

import { User } from 'src/entity/User';

export class RegisterUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  @MinLength(3)
  @MaxLength(30)
  readonly login: User['login'];

  @ApiProperty({ example: 'alex_track' })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  readonly name: User['name'];

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  readonly password: User['password'];
}
