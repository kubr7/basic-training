// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];

    @ManyToMany(() => Post, (post) => post.likedBy, { eager: false })
    likedPosts: Post[];

    // @ManyToMany(() => User, (user) => user.friends)
    // @JoinTable()
    // friends: User[];

    @ManyToMany(() => User, user => user.friends)
    @JoinTable({
        name: 'user_friends', // custom join table name
        joinColumn: {
            name: 'user_id',        // current user's column
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'friend_id',      // friend's column
            referencedColumnName: 'id',
        },
    })
    friends: User[];

}
