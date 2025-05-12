// src/friends/friends.service.ts
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FriendRequest, FriendRequestStatus } from './friend-request.entity';
import { User } from '../users/user.entity';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(FriendRequest)
        private friendRequestRepository: Repository<FriendRequest>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
        private dataSource: DataSource,
    ) { }

    async sendFriendRequest(senderUsername: string, receiverUsername: string) {
        if (senderUsername === receiverUsername) {
            throw new BadRequestException('You cannot send a friend request to yourself');
        }

        const sender = await this.userRepository.findOne({
            where: { username: senderUsername },
            relations: ['friends'],
        });

        const receiver = await this.userRepository.findOneBy({ username: receiverUsername });

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or receiver not found');
        }

        const alreadyFriends = sender.friends.some(friend => friend.id === receiver.id);
        if (alreadyFriends) {
            throw new ConflictException('You are already friends');
        }

        const existingRequest = await this.friendRequestRepository.findOne({
            where: {
                sender: { id: sender.id },
                receiver: { id: receiver.id },
                status: FriendRequestStatus.PENDING,
            },
        });

        if (existingRequest) {
            throw new ConflictException('Friend request already sent');
        }

        const friendRequest = this.friendRequestRepository.create({
            sender,
            receiver,
            status: FriendRequestStatus.PENDING,
        });

        await this.friendRequestRepository.save(friendRequest);

        return {
            success: true,
            message: 'Friend request sent',
        };
    }

    async acceptFriendRequest(senderUsername: string, receiverUsername: string) {
        const sender = await this.userRepository.findOne({
            where: { username: senderUsername },
            relations: ['friends'],
        });

        const receiver = await this.userRepository.findOne({
            where: { username: receiverUsername },
            relations: ['friends'],
        });

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or receiver not found');
        }

        const request = await this.friendRequestRepository.findOne({
            where: {
                sender: { id: sender.id },
                receiver: { id: receiver.id },
                status: FriendRequestStatus.PENDING,
            },
            relations: ['sender', 'receiver'],
        });

        if (!request) {
            throw new NotFoundException('Pending friend request not found');
        }

        await this.dataSource.transaction(async manager => {
            // 1. Update request status
            request.status = FriendRequestStatus.ACCEPTED;
            await manager.save(request);

            // 2. Add friends bidirectionally
            sender.friends.push(receiver);
            receiver.friends.push(sender);
            await manager.save(sender);
            await manager.save(receiver);

            // 3. Remove reverse pending request (if exists)
            await manager.delete(FriendRequest, {
                sender: { id: receiver.id },
                receiver: { id: sender.id },
                status: FriendRequestStatus.PENDING,
            });
        });

        return {
            success: true,
            message: 'Friend request accepted and users are now friends',
            friends: [
                `${sender.firstName} ${sender.lastName}`,
                `${receiver.firstName} ${receiver.lastName}`,
            ],
        };
    }

    async rejectFriendRequest(senderUsername: string, receiverUsername: string) {
        const sender = await this.userRepository.findOneBy({ username: senderUsername });
        const receiver = await this.userRepository.findOneBy({ username: receiverUsername });

        if (!sender || !receiver) {
            throw new NotFoundException('Sender or receiver not found');
        }

        const request = await this.friendRequestRepository.findOne({
            where: {
                sender: { id: sender.id },
                receiver: { id: receiver.id },
                status: FriendRequestStatus.PENDING,
            },
        });

        if (!request) {
            throw new NotFoundException('Pending friend request not found');
        }

        request.status = FriendRequestStatus.REJECTED;
        await this.friendRequestRepository.save(request);

        return {
            success: true,
            message: 'Friend request rejected',
        };
    }

    async getFriendRequests(username: string) {
        const user = await this.userRepository.findOneBy({ username });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const requests = await this.friendRequestRepository.find({
            where: {
                receiver: { id: user.id },
                status: FriendRequestStatus.PENDING,
            },
            relations: ['sender'],
            order: { createdAt: 'DESC' },
        });

        if (!requests || requests.length === 0) {
            throw new NotFoundException('No friend requests found');
        }

        return requests.map(request => `${request.sender.firstName} ${request.sender.lastName}`);
    }

    async getFriends(username: string): Promise<string[]> {
        const user = await this.userRepository.findOne({
            where: { username },
            relations: ['friends'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.friends || user.friends.length === 0) {
            throw new NotFoundException('No friends found for this user');
        }

        // return user.friends.map(friend => ({ name: `${friend.firstName} ${friend.lastName}` }));
        return user.friends.map(friend => `${friend.firstName} ${friend.lastName}`);

    }
}
