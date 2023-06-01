import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { CommentEntity } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created',
  })
  @ApiBody({ type: CreateCommentDto })
  @HttpCode(201)
  @Post()
  async create(
    @Res() res: Response,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    const comment = await this.commentsService.create(createCommentDto);
    res.set('Location', `/comments/${comment.id}`);
    return comment;
  }

  @ApiOperation({ summary: 'Retrieve all comments' })
  @ApiResponse({
    status: 200,
    description: 'List of all comments',
    type: [CommentEntity],
  })
  @Get()
  async findAll(): Promise<CommentEntity[]> {
    return this.commentsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a comment by ID' })
  @ApiResponse({
    status: 200,
    description: 'The comment with the matching ID',
    type: CommentEntity,
  })
  @ApiResponse({ status: 404, description: 'No comment found for matching ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CommentEntity> {
    const comment = await this.commentsService.findOne(id);
    if (!comment) {
      throw new Error(`Comment with id: ${id} not found`);
    }
    return comment;
  }

  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully updated.',
    type: CommentEntity,
  })
  @ApiResponse({ status: 404, description: 'No comment found for matching ID' })
  @ApiBody({ type: UpdateCommentDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentsService.update(id, updateCommentDto);
  }

  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'No comment found for matching ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
