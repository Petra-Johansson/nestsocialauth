import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly contractNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly image?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  readonly password: string;
}
