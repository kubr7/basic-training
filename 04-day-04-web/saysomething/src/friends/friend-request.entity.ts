// src/friends/friend-request.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Index, Unique } from 'typeorm';
import { User } from '../users/user.entity';

export enum FriendRequestStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

@Entity()
@Unique(['sender', 'receiver'])
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Index()
    sender: User;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @Index()
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