// src/users/users.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
        private readonly userRepository: Repository<User>,
    ) { }


    async createUser(username: string, firstName: string, lastName: string, email: string, password: string): Promise<UserResponseDto> {
        try {
            const user = this.userRepository.create({ username, firstName, lastName, email, password });
            const savedUser = await this.userRepository.save(user);
            return plainToInstance(UserResponseDto, savedUser);
        } catch (error) {
            console.error('Error saving user:', error);
            throw new InternalServerErrorException('Could not save user');
        }
    }

    async getAllUsers(): Promise<GetAllUsersDto[]> {
        const users = await this.userRepository.find();
        return plainToInstance(GetAllUsersDto, users, {excludeExtraneousValues: true});
    }

    async getUserById(id: number): Promise<GetAllUsersDto> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return plainToInstance(GetAllUsersDto, user, { excludeExtraneousValues: true });
    }

    async getUserFriends(username: string): Promise<UserFriendDto[]> {
        const user = await this.userRepository.findOne({
            where: { username },
            relations: ['friends'],
        });
        if (!user) throw new NotFoundException('User not found');
        return plainToInstance(UserFriendDto, user.friends, { excludeExtraneousValues: true });
    }

    async isUsernameTaken(username: string): Promise<boolean> {
        return await this.userRepository.exists({ where: { username } });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }
}
