import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiResponse,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Res() res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersService.create(createUserDto);
    res.set('Location', `/users/${user.id}`);
    return user;
  }

  @ApiOkResponse({
    description: 'Returns an array of users.',
    type: UserEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'get all users' })
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user with the matching ID',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'No user found for matching ID' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserEntity,
  })
  @ApiResponse({ status: 404, description: 'No user found for matching ID' })
  @ApiBody({ type: UpdateUserDto })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
