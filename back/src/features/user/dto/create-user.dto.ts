import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from 'src/entity/User';

export class CreateUserDto {
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

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly isApproved?: User['isApproved'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds?: number[];
}
