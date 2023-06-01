import {
  IsNotEmpty,
  IsString,
  IsUUID,
  ArrayNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsOptional()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags?: CreateTagDto[];
}
