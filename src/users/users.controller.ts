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
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiResponse,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserId } from 'src/auth/decorators/user-id.decorator';
import { UserIsUserGuard } from './guards/user-is-user.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
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
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    res.set('Location', `/users/${user.id}`);
    return res.status(HttpStatus.CREATED).json(user);
  }

  @ApiOkResponse({
    description: 'Returns an array of users.',
    type: UserEntity,
    isArray: true,
  })
  @ApiOperation({ summary: 'get all users' })
  @Get()
  @UseGuards(JwtAuthGuard)
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
  @Get('by-id/:id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async findOne(@Query('id') id: string): Promise<UserEntity> {
    console.log(id);
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @ApiOperation({ summary: 'Get an authenticated users profile' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user with token.',
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@UserId() userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
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
  @Put()
  @UseGuards(JwtAuthGuard)
  async update(
    @UserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(userId, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  @Delete()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@UserId() userId: string): Promise<void> {
    return this.usersService.remove(userId);
  }
}
