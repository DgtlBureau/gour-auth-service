import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiUser } from 'src/entity/ApiUser';

export class CreateUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
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

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  readonly isApproved?: ApiUser['isApproved'];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  readonly roleIds?: string[];
}
