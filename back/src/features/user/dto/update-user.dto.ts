import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiUser } from 'src/entity/ApiUser';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly login: ApiUser['login'];

  @ApiPropertyOptional({ example: 'alex_track' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly name: ApiUser['name'];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(30)
  readonly password: ApiUser['password'];
}
