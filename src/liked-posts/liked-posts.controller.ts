import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { LikedPostsService } from './liked-posts.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/auth/decorators/user-id.decorator';

@Controller('liked-posts')
export class LikedPostsController {
  constructor(private readonly likedPostsService: LikedPostsService) {}

  @ApiOperation({ summary: 'Add a like to a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully liked.',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @Post('/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(@UserId() userId: string, @Param('id') id: string) {
    return this.likedPostsService.likePost(userId, id);
  }

  @ApiOperation({ summary: 'Remove a like from a post' })
  @ApiResponse({
    status: 200,
    description: 'A like has been successfully removed from the post.',
    type: String,
  })
  @ApiResponse({ status: 404, description: 'No post found for matching ID' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeLikeFromPost(
    @UserId() userId: string,
    @Param('id') id: string,
  ): Promise<string> {
    console.log(userId);
    console.log(id);
    return this.likedPostsService.unlikePost(userId, id);
  }
}
