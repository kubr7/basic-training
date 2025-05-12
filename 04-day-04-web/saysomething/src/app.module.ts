// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { FriendsModule } from './friends/friends.module';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';
import { FriendRequest } from './friends/friend-request.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'parikunj28@',
      database: 'saysomething_db',
      entities: [User, Post, FriendRequest],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    TypeOrmModule.forFeature([User, Post]),
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
