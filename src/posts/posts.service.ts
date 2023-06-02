import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

/**
 * Service to manage posts.
 */
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  private readonly logger = new Logger('PostsService');

  /**
   * Create a new post.
   * @param {CreatePostDto} createPostDto - The information of the post to create.
   * @returns {Promise<PostEntity>} A promise that resolves to the created post.
   */
  async create(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<PostEntity> {
    try {
      const post = this.postRepository.create({
        ...createPostDto,
        user: { id: userId },
      });
      const savedPost = await this.postRepository.save(post);
      this.logger.log(`Post with id ${savedPost.id} was created`);
      return savedPost;
    } catch (error) {
      this.logger.error(`Failed to create post: ${error.message}`);
      throw new HttpException(
        'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all posts.
   * @returns {Promise<PostEntity[]>} A promise that resolves to an array of posts.
   */
  async findAll(): Promise<PostEntity[]> {
    try {
      return await this.postRepository.find();
    } catch (error) {
      this.logger.error(`Failed to find posts: ${error.message}`);
      throw new HttpException(
        'Failed to find posts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all posts by userId
   * @returns {Promise<PostEntity[]>} A promise that resolves to an array of posts.
   */
  async findByUserId(userId: string): Promise<PostEntity[]> {
    try {
      return await this.postRepository.find({
        where: { user: { id: userId } },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find posts: ${error.message}`);
      throw new HttpException(
        'Failed to find posts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a post by ID.
   * @param {string} id - The ID of the post to retrieve.
   * @returns {Promise<PostEntity>} A promise that resolves to the post, if found.
   */
  async findOne(id: string): Promise<PostEntity> {
    try {
      const post = await this.postRepository.findOne({ where: { id: id } });
      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      return post;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find post: ${error.message}`);
      throw new HttpException(
        'Failed to find post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find a post by slug.
   * @param {string} slug - The slug of the post to retrieve.
   * @returns {Promise<PostEntity>} A promise that resolves to the post, if found.
   */
  async findPostBySlug(slug: string): Promise<PostEntity> {
    const post = await this.postRepository.findOne({ where: { slug: slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug ${slug} not found`);
    }
    return post;
  }

  /**
   * Add a like to a post.
   * @param {string} id - The ID of the post to like.
   * @returns {Promise<PostEntity>} A promise that resolves to the liked post.
   */
  async likePost(id: string): Promise<PostEntity> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    post.likes += 1;
    return this.postRepository.save(post);
  }

  /**
   * Remove a like from a post.
   * @param {string} id - The ID of the post to unlike.
   * @returns {Promise<PostEntity>} A promise that resolves to the unliked post.
   */
  async removeLikeFromPost(id: string): Promise<PostEntity> {
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    if (post.likes > 0) {
      post.likes -= 1;
    }
    return this.postRepository.save(post);
  }

  /**
   * Update a post.
   * @param {number} id - The ID of the post to update.
   * @param {UpdatePostDto} updatePostDto - The new information of the post.
   * @returns {Promise<PostEntity>} A promise that resolves to the updated post, if found.
   */
  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    try {
      const post = await this.postRepository.preload({
        id: id,
        ...updatePostDto,
      });
      if (!post) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      const updatedPost = await this.postRepository.save(post);
      this.logger.log(`Post with id ${id} was updated`);
      return updatedPost;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update post: ${error.message}`);
      throw new HttpException(
        'Failed to update post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove a post.
   * @param {string} id - The ID of the post to remove.
   * @returns {Promise<void>} A promise that resolves when the post is removed.
   */
  async remove(id: string): Promise<void> {
    try {
      const post = await this.findOne(id);
      if (post) {
        await this.postRepository.delete(id);
        this.logger.log(`Post with id ${id} was deleted`);
      } else {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete post: ${error.message}`);
      throw new HttpException(
        'Failed to delete post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
