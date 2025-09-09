// src/posts/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable, Index } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256 })
    @Index()
    content: string;

    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    author: User;

    @ManyToMany(() => User, user => user.likedPosts)
    @JoinTable()
    likedBy: User[];

    @CreateDateColumn()
    createdAt: Date;
}
