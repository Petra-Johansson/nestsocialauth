import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly contractNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly image?: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
