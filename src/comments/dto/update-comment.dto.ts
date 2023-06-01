import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}
