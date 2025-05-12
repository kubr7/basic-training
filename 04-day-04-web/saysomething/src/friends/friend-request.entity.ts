// src/friends/friend-request.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum FriendRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    sender: User;

    @ManyToOne(() => User)
    receiver: User;

    @Column({
        type: 'enum',
        enum: FriendRequestStatus,
        default: FriendRequestStatus.PENDING,
    })
    status: FriendRequestStatus;

    @CreateDateColumn()
    createdAt: Date;
} 