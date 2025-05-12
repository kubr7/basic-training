// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { FriendRequest } from './friends/friend-request.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'parikunj28@',
    database: 'saysomething_db',
    synchronize: false,
    // entities: ['src/**/*.entity.ts'],
    // entities: [__dirname + '/**/*.entity.{ts,js}'],
    entities: [User, Post, FriendRequest],
    logging: true,
    migrations: ['src/migrations/*.ts'],
});
