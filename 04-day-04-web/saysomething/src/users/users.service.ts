// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { UserFriendDto } from './dto/user-friend.dto';
import { GetAllUsersDto } from './dto/get-all-users.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }


    // private users = [
    //     {
    //         id: 1,
    //         email: 'test@test.com',
    //         password: 'test',
    //         friends: [],
    //         friendRequests: [],
    //         posts: [],
    //     },
    //     {
    //         id: 2,
    //         email: 'test2@test.com',
    //         password: 'test',
    //         friends: [],
    //     }
    // ]

    async createUser(username: string, firstName: string, lastName: string, email: string, password: string): Promise<UserResponseDto> {
        try {
            const user = this.userRepository.create({ username, firstName, lastName, email, password });
            const savedUser = await this.userRepository.save(user);
            console.log('Saved user:', savedUser);
            return plainToInstance(UserResponseDto, savedUser);
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Could not save user');
        }
    }

    async getAllUsers(): Promise<GetAllUsersDto[]> {
        const users = await this.userRepository.find();
        return users.map(user => plainToInstance(GetAllUsersDto, user, { excludeExtraneousValues: true }));
    }

    async getUserById(id: number): Promise<GetAllUsersDto> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return plainToInstance(GetAllUsersDto, user, { excludeExtraneousValues: true });
    }

    async getUserFriends(username: string): Promise<UserFriendDto[]> {
        const user = await this.userRepository.findOne({ where: { username }, relations: ['friends'] });
        return user ? plainToInstance(UserFriendDto, user.friends, { excludeExtraneousValues: true }) : [];
    }

    async isUsernameTaken(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ where: { username } });
        return !!user;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ username });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }

    // async getUserByEmail(email: string): Promise<UserResponseDto | null> {
    //     const user = await this.userRepository.findOneBy({ email });
    //     return user ? plainToInstance(UserResponseDto, user) : null;
    // }
}
