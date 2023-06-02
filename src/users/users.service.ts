import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
  ForbiddenException,
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
      this.logger.error(`Failed to find user: ${error.message}`);
      throw new HttpException(
        'Failed to find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a user by email.
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves to the user, if found.
   */
  async findOneByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: email },
        select: [
          'id',
          'name',
          'email',
          'phone',
          'contractNumber',
          'image',
          'roles',
          'password',
          'createdAt',
          'updatedAt',
        ],
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find user: ${error.message}`);
      throw new HttpException(
        'Failed to find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get a user by refreshToken.
   * @param {string} refreshToken - The refreshToken of the user to retrieve.
   * @returns {Promise<UserEntity>} A promise that resolves to the user, if found.
   */
  async findOneByRefreshToken(refreshToken: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { refreshTokens: { token: refreshToken } },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${refreshToken} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find user: ${error.message}`);
      throw new HttpException(
        'Failed to find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update a user.
   * @param {UpdateUserDto} updateUserDto - The new information of the user.
   * @returns {Promise<UserEntity>} A promise that resolves to the updated user, if found.
   */
  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      const user = await this.userRepository.preload({
        id: userId,
        ...updateUserDto,
      });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const updatedUser = await this.userRepository.save(user);
      this.logger.log(`User with id ${userId} was updated`);
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
