import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';

/**
 * Service to manage tags.
 */
@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  private readonly logger = new Logger('TagsService');

  /**
   * Create a new tag.
   * @param {CreateTagDto} createTagDto - The information of the tag to create.
   * @returns {Promise<TagEntity>} A promise that resolves to the created tag.
   */
  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    try {
      const tag = this.tagRepository.create(createTagDto);
      const savedTag = await this.tagRepository.save(tag);
      this.logger.log(`Tag with id ${savedTag.id} was created`);
      return savedTag;
    } catch (error) {
      this.logger.error(`Failed to create tag: ${error.message}`);
      throw new HttpException(
        'Failed to create tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all tags.
   * @returns {Promise<TagEntity[]>} A promise that resolves to an array of tags.
   */
  async findAll(): Promise<TagEntity[]> {
    try {
      return await this.tagRepository.find();
    } catch (error) {
      console.error(`Failed to find tags: ${error.message}`);
      throw new HttpException(
        'Failed to find tags',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a tag by ID.
   * @param {string} id - The ID of the tag to retrieve.
   * @returns {Promise<TagEntity>} A promise that resolves to the tag, if found.
   */
  async findOne(id: string): Promise<TagEntity> {
    try {
      const tag = await this.tagRepository.findOne({ where: { id: id } });
      if (!tag) {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
      return tag;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Failed to find tag: ${error.message}`);
      throw new HttpException(
        'Failed to find tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove a tag.
   * @param {string} id - The ID of the tag to remove.
   * @returns {Promise<void>} A promise that resolves when the tag is removed.
   */
  async remove(id: string): Promise<void> {
    try {
      const tag = await this.findOne(id);
      if (tag) {
        await this.tagRepository.delete(id);
        this.logger.log(`Tag with id ${id} was deleted`);
      } else {
        throw new NotFoundException(`Tag with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete tag: ${error.message}`);
      throw new HttpException(
        'Failed to delete tag',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
