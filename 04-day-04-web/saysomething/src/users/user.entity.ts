// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, Index } from 'typeorm';
import { Post } from '../posts/post.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @Index()
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    @Index()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];

    @ManyToMany(() => Post, (post) => post.likedBy)
    likedPosts: Post[];


    @ManyToMany(() => User, user => user.friends)
    @JoinTable({
        name: 'user_friends',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'friend_id',
            referencedColumnName: 'id',
        },
    })
    friends: User[];

}
