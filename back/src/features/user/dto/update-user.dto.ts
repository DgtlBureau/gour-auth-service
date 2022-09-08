import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/entity/User';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly login: User['login'];

  @ApiPropertyOptional({ example: 'alex_track' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  readonly name: User['name'];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(30)
  password: User['password'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds: number[];
}
