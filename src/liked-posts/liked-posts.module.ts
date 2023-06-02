import { Module } from '@nestjs/common';
import { LikedPostsService } from './liked-posts.service';
import { LikedPostsController } from './liked-posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
  controllers: [LikedPostsController],
  providers: [LikedPostsService],
})
export class LikedPostsModule {}
