import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
