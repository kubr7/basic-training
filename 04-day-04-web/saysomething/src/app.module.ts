// src/app.module.ts
import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { PostModule } from './posts/posts.module';
import { FriendsModule } from './friends/friends.module';
// import { User } from './users/user.entity';
// import { Post } from './posts/post.entity';
// import { FriendRequest } from './friends/friend-request.entity';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // entities: [User, Post, FriendRequest],
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    PostModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
