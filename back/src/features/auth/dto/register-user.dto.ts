import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'alex' })
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'track' })
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly role: string;
}
