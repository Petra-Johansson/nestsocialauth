import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { Repository } from 'typeorm';

/**
 * Service to manage comments.
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  private readonly logger = new Logger('CommentsService');

  /**
   * Create a new comment
   * @param {CreateCommentDto} createCommentDto - The information of the comment to create.
   * @returns {Promise<PostEntity>} - A promise that resolves to the created comment.
   */
  async create(createCommentDto: CreateCommentDto): Promise<CommentEntity> {
    try {
      const comment = this.commentRepository.create(createCommentDto);
      const savedComment = await this.commentRepository.save(comment);
      this.logger.log(`Comment with id  ${savedComment.id} was created`);
      return savedComment;
    } catch (error) {
      this.logger.log(`Faile to create post ${error.message}`);
      throw new HttpException(
        'Failed to create post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Retrieve all comments
   * @returns {Promise<CommentEntity[]>} - A pormise that resolves to an array of comments.
   */
  async findAll(): Promise<CommentEntity[]> {
    try {
      return await this.commentRepository.find();
    } catch (error) {
      this.logger.error(`Failed to find comments: ${error.message}`);
      throw new HttpException(
        'Failed to find comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param {number} id - The ID of the comment to retrieve
   * @returns {Promise<COmment>} A promise that resolves to the comment, if found.
   */
  async findOne(id: string): Promise<CommentEntity> {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: id },
      });
      if (!comment) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
      return comment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find post ${error.message}`);
      throw new HttpException(
        'Failed to find comment ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   *
   * @param {number} id - The ID of the comment to update
   * @param {UpdateCommentDto} updateCommentDto - The new information of the comment.
   * @returns {Promise<CommentEntity>} - A Promise that resolves to update the comment.
   */
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    try {
      const comment = await this.commentRepository.preload({
        id: id,
        ...updateCommentDto,
      });
      if (!comment) {
        throw new NotFoundException(`No comment with id ${id} found`);
      }

      const updatedComment = await this.commentRepository.save(comment);
      this.logger.log(`Comment with id ${id} was updated`);
      return updatedComment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update comment: ${error.message}`);
      throw new HttpException(
        'Failed to update comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Remove a comment.
   * @param {string} id - The ID of the comment to remove.
   * @returns {Promise<void>} A promise that resolves when the comment is removed.
   */
  async remove(id: string): Promise<void> {
    try {
      const comment = await this.findOne(id);
      if (comment) {
        await this.commentRepository.delete(id);
        this.logger.log(`Comment with id ${id} was deleted`);
      } else {
        throw new NotFoundException(`COmment with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete comment: ${error.message}`);
      throw new HttpException(
        'Failed to delete post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
