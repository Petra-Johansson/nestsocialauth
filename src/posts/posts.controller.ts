import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiBody({ type: CreatePostDto })
  @HttpCode(201)
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Res() res: Response,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    const post = await this.postsService.create(createPostDto);
    res.set('Location', `/posts/${post.id}`);
    return post;
  }
  @ApiOperation({ summary: 'Retrieve all posts' })
  @ApiResponse({
    status: 200,
    description: 'List of all posts',
    type: [PostEntity],
  })
  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post with the matching ID',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity> {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @ApiOperation({ summary: 'Retrieve posts by userId' })
  @ApiResponse({
    status: 200,
    description: 'The posts with the matching userId',
    type: [PostEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'No posts found for matching userId',
  })
  @Get(':userId')
  async findByUserId(@Param('userId') userId: string): Promise<PostEntity[]> {
    const posts = await this.postsService.findByUserId(userId);
    if (!posts) {
      throw new NotFoundException(`Posts with userId ${userId} not found`);
    }
    return posts;
  }

  @ApiOperation({ summary: 'Retrieve a post by slug' })
  @ApiResponse({
    status: 200,
    description: 'The post with the matching slug',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching slug' })
  @Get('/slug/:slug')
  async findPostBySlug(@Param('slug') slug: string): Promise<PostEntity> {
    const post = await this.postsService.findPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }
    return post;
  }

  @ApiOperation({ summary: 'Add a like to a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully liked.',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @Post(':id/like')
  async likePost(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.likePost(id);
  }

  @ApiOperation({ summary: 'Remove a like from a post' })
  @ApiResponse({
    status: 200,
    description: 'A like has been successfully removed from the post.',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @Post(':id/unlike')
  async removeLikeFromPost(@Param('id') id: string): Promise<PostEntity> {
    return this.postsService.removeLikeFromPost(id);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PostEntity,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @ApiBody({ type: UpdatePostDto })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(id);
  }
}
