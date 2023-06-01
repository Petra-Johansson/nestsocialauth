import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  postId: string;
}
