// src/users/users.controller.ts
import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UserFriendDto } from './dto/user-friend.dto';
import { GetAllUsersDto } from './dto/get-all-users.dto';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    async getAllUsers(): Promise<GetAllUsersDto[]> {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number): Promise<GetAllUsersDto> {
        return this.userService.getUserById(id);
    }

    @Post(':username')
    async getUserByUsername(@Param('username') username: string): Promise<User | null> {
        return this.userService.getUserByUsername(username);
    }

    @Get(':username/friends')
    async getUserFriends(@Param('username') username: string): Promise<UserFriendDto[]> {
        return this.userService.getUserFriends(username);
    }

    @Post()
    async getUserByEmail(@Body() email: string) {
        return this.userService.getUserByEmail(email);
    }

}