import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikedPostsService {
  private readonly logger = new Logger(LikedPostsService.name);

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
  ) {}

  /**
   * Handles the liking of a post by a user.
   * If the user has already liked the post, it will return an appropriate message.
   *
   * @param {string} userId - The id of the user who is liking the post.
   * @param {string} postId - The id of the post being liked.
   * @returns {Promise<string>} A message indicating the result of the operation.
   */
  async likePost(userId: string, postId: string): Promise<string> {
    this.logger.log(`User ${userId} attempting to like post ${postId}`);

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['liked'],
    });
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    });

    if (!user || !post) {
      this.logger.warn('User or Post not found');
      return 'User or Post not found';
    }

    if (user.liked.some((likedPost) => likedPost.id === post.id)) {
      this.logger.warn('User has already liked this post');
      return 'User has already liked this post';
    }

    user.liked.push(post);
    post.likes += 1;
    post.likedBy.push(user);

    await this.usersRepository.save(user);
    await this.postsRepository.save(post);

    this.logger.log(`User ${userId} liked post ${postId} successfully`);
    return 'Post liked successfully';
  }

  /**
   * Handles the unliking of a post by a user.
   * If the user hasn't liked the post, it will return an appropriate message.
   *
   * @param {string} userId - The id of the user who is unliking the post.
   * @param {string} postId - The id of the post being unliked.
   * @returns {Promise<string>} A message indicating the result of the operation.
   */
  async unlikePost(userId: string, postId: string): Promise<string> {
    this.logger.log(`User ${userId} attempting to unlike post ${postId}`);

    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['liked'],
    });
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['likedBy'],
    });

    if (!user || !post) {
      this.logger.warn('User or Post not found');
      return 'User or Post not found';
    }

    const likedPostIndex = user.liked.findIndex(
      (likedPost) => likedPost.id === post.id,
    );

    if (likedPostIndex === -1) {
      this.logger.warn('User has not liked this post');
      return 'User has not liked this post';
    }

    // Remove the post from the user's likedPosts
    user.liked.splice(likedPostIndex, 1);

    // Find the user in the post's likedBy array
    const likedByIndex = post.likedBy.findIndex(
      (likedUser) => likedUser.id === user.id,
    );

    // Remove the user from the post's likedBy
    post.likedBy.splice(likedByIndex, 1);

    // Decrement the likes count of the post
    post.likes -= 1;

    await this.usersRepository.save(user);
    await this.postsRepository.save(post);

    this.logger.log(`User ${userId} unliked post ${postId} successfully`);
    return 'Post unliked successfully';
  }
}
