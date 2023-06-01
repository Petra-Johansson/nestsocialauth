import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @ApiBody({ type: CreateTagDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Res() res: Response,
    @Body() createTagDto: CreateTagDto,
  ): Promise<TagEntity> {
    const tag = await this.tagsService.create(createTagDto);
    res.set('Location', `/tags/${tag.id}`);
    return tag;
  }

  @ApiOkResponse({
    description: 'Returns an array of tags.',
    type: TagEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'get all tags' })
  @Get()
  async findAll(): Promise<TagEntity[]> {
    return this.tagsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a tag by ID' })
  @ApiResponse({
    status: 200,
    description: 'The tag with the matching ID',
    type: TagEntity,
  })
  @ApiResponse({ status: 404, description: 'No tag found for matching ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TagEntity> {
    const tag = await this.tagsService.findOne(id);
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({
    status: 204,
    description: 'The tag has been successfully deleted.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.tagsService.remove(id);
  }
}
