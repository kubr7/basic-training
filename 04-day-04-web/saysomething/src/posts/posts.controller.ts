// src/posts/posts.controller.ts
import { Controller, Post, Body, Param, Get, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostResponseDto } from './dto/post-response.dto';
import { CreatePostResponseDto } from './dto/create-post-reponse.dto';
import { PostLikeResponseDto } from './dto/post-like-reponse.dto';
import { PostByUserResponseDto } from './dto/post-by-user-response.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { LikePostDto } from './dto/like-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    @ApiOperation({ summary: 'Create a new post' })
    @ApiBody({ type: CreatePostDto })
    @ApiCreatedResponse({ description: 'Post created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async createPost(
        // @Body('username') username: string,
        @Request() req,
        @Body('content') content: string,
    ): Promise<CreatePostResponseDto> {
        const username = req.user.username;
        return this.postService.createPost(username, content);
    }

    @UseGuards(JwtAuthGuard)
    @Post('like/:postId')
    @ApiOperation({ summary: 'Like a post' })
    @ApiParam({ type: Number, name: 'postId' })
    @ApiBody({ type: LikePostDto })
    @ApiCreatedResponse({ description: 'Post liked successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async likePost(
        @Param('postId') postId: number,
        @Body('username') username: string,
    ): Promise<PostLikeResponseDto> {
        return this.postService.likePost(postId, username);
    }


    @Get()
    @ApiOperation({ summary: 'Get all posts' })
    @ApiCreatedResponse({ description: 'Posts retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async getAllPosts(): Promise<PostResponseDto[]> {
        return this.postService.getAllPosts();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:username')
    @ApiOperation({ summary: 'Get posts by username' })
    @ApiParam({ type: String, name: 'username' })
    @ApiCreatedResponse({ description: 'Posts retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async getPostsByUsername(@Param('username') username: string): Promise<PostByUserResponseDto[]> {
        return this.postService.getPostsByUsername(username);
    }
}
