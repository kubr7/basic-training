// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
// import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'parikunj28@',
    database: 'social_media_db',
    synchronize: false,
    entities: ['src/**/*.entity.ts'],
    // entities: [__dirname + '/**/*.entity.{ts,js}'],
    logging: true,
    migrations: ['src/migrations/*.ts'],
});
