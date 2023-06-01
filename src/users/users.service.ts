import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

/**
 * Service to manage users.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private readonly logger = new Logger('UsersService');

  /**
   * Create a new user.
   * @param {CreateUserDto} createUserDto - The information of the user to create.
   * @returns {Promise<UserEntity>} A promise that resolves to the created user.
   */
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User with id ${savedUser.id} was created`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new HttpException(
        'Failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all users.
   * @returns {Promise<UserEntity[]>} A promise that resolves to an array of users.
   */
  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error(`Failed to find users: ${error.message}`);
      throw new HttpException(
        'Failed to find users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves to the user, if found.
   */
  async findOne(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Failed to find user: ${error.message}`);
      throw new HttpException(
        'Failed to find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a user.
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The new information of the user.
   * @returns {Promise<UserEntity>} A promise that resolves to the updated user, if found.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.preload({
        id: id,
        ...updateUserDto,
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`User with id ${id} was updated`);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update user: ${error.message}`);
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Remove a user.
   * @param {string} id - The ID of the user to remove.
   * @returns {Promise<void>} A promise that resolves when the user is removed.
   */
  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      if (user) {
        await this.userRepository.delete(id);
        this.logger.log(`User with id ${id} was deleted`);
      } else {
        throw new NotFoundException(`User with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete user: ${error.message}`);
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
