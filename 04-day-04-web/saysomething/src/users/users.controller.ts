// src/users/users.controller.ts
import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { UserService } from './users.service';
// import { UserResponseDto } from './dto/user-response.dto';
import { UserFriendDto } from './dto/user-friend.dto';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { User } from './user.entity';
import { ApiOperation, ApiQuery, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({
        description: 'All users retrieved successfully',
        type: GetAllUsersDto,
        isArray: true, // Because this returns an array
    })
    @ApiNotFoundResponse({ description: 'No users found' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    async getAllUsers(): Promise<GetAllUsersDto[]> {
        return this.userService.getAllUsers();
    }


    @Get(':id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({
        description: 'User retrieved successfully',
        type: GetAllUsersDto,
    })
    @ApiNotFoundResponse({ description: 'User not found' })
    async getUserById(@Param('id') id: number): Promise<GetAllUsersDto> {
        return this.userService.getUserById(id);
    }

    @Get('by-email/:email')
    @ApiOperation({ summary: 'Get user by email' })
    @ApiParam({ name: 'email', type: String })
    @ApiOkResponse({
        description: 'User retrieved successfully',
        type: User,
    })
    @ApiBadRequestResponse({ description: 'Invalid email or user not found' })
    async getUserByEmail(@Param('email') email: string): Promise<User | null> {
        return this.userService.getUserByEmail(email);
    }

    @Get('by-username/:username')
    @ApiOperation({ summary: 'Get a user by username' })
    @ApiParam({ name: 'username', type: String })
    @ApiOkResponse({
        description: 'User retrieved successfully',
        type: User,
    })
    @ApiNotFoundResponse({ description: 'User not found' })
    async getUserByUsername(@Param('username') username: string): Promise<User | null> {
        return this.userService.getUserByUsername(username);
    }

    @Get(':username/friends')
    @ApiOperation({ summary: 'Get user friends by username' })
    @ApiParam({ name: 'username', type: String })
    @ApiOkResponse({
        description: 'User friends retrieved successfully',
        type: UserFriendDto,
        isArray: true,
    })
    @ApiNotFoundResponse({ description: 'User not found or no friends' })
    async getUserFriends(@Param('username') username: string): Promise<UserFriendDto[]> {
        return this.userService.getUserFriends(username);
    }   

}