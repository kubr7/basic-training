import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async getUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(email: string, password: string): Promise<User> {
        try {
            const user = this.userRepository.create({ email, password });
            const savedUser = await this.userRepository.save(user);
            console.log('Saved user:', savedUser);
            return savedUser;
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Could not save user');
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email });
    }

    async sendFriendRequest(senderId: number, receiverId: number) {
        const sender = await this.userRepository.findOne({ where: { id: senderId }, relations: ['friendRequests'] });
        const receiver = await this.userRepository.findOne({ where: { id: receiverId }, relations: ['friendRequests'] });

        if (!sender || !receiver) {
            throw new Error('User not found');
        }

        if (!receiver.friendRequests.find(req => req.id === sender.id)) {
            receiver.friendRequests.push(sender);
            await this.userRepository.save(receiver);
        }
    }

    async acceptFriendRequest(senderId: number, receiverId: number) {
        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        const receiver = await this.userRepository.findOne({ where: { id: receiverId }, relations: ['friendRequests', 'friends'] });

        if (!sender || !receiver) {
            throw new Error('User not found');
        }

        receiver.friendRequests = receiver.friendRequests.filter(req => req.id !== sender.id);
        receiver.friends.push(sender);
        sender.friends.push(receiver);

        await this.userRepository.save(sender);
        await this.userRepository.save(receiver);

        return { success: true, message: 'Friend request accepted' };
    }

    async rejectFriendRequest(senderId: number, receiverId: number) {
        const receiver = await this.userRepository.findOne({ where: { id: receiverId }, relations: ['friendRequests'] });

        if (!receiver) {
            throw new Error('User not found');
        }

        receiver.friendRequests = receiver.friendRequests.filter(req => req.id !== senderId);
        await this.userRepository.save(receiver);
    }
}
