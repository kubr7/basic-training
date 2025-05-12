// src/posts/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 256 })
    content: string;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

    @ManyToMany(() => User, user => user.likedPosts, { eager: false })
    @JoinTable()
    likedBy: User[];

    @CreateDateColumn()
    createdAt: Date;
}
