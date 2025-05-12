// src/posts/posts.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';
import { CreatePostResponseDto } from './dto/create-post-reponse.dto';
import { PostLikeResponseDto } from './dto/post-like-reponse.dto';
import { PostByUserResponseDto } from './dto/post-by-user-response.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @Post('create')
    async createPost(
        @Body('username') username: string,
        @Body('content') content: string,
    ): Promise<CreatePostResponseDto> {
        return this.postService.createPost(username, content);
    }

    @Post('like/:postId')
    async likePost(
        @Param('postId') postId: number,
        @Body('username') username: string,
    ): Promise<PostLikeResponseDto> {
        return this.postService.likePost(postId, username);
    }

    @Get()
    async getAllPosts(): Promise<PostResponseDto[]> {
        return this.postService.getAllPosts();
    }

    @Get('/:username')
    async getPostsByUsername(@Param('username') username: string): Promise<PostByUserResponseDto[]> {
        return this.postService.getPostsByUsername(username);
    }
}
