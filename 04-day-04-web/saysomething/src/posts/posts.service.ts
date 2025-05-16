// src/posts/posts.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { plainToInstance } from 'class-transformer';
import { PostResponseDto } from './dto/post-response.dto';
import { CreatePostResponseDto } from './dto/create-post-reponse.dto';
import { PostLikeResponseDto } from './dto/post-like-reponse.dto';
import { PostByUserResponseDto } from './dto/post-by-user-response.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createPost(username: string, content: string): Promise<CreatePostResponseDto> {
        if (content.length > 256) {
            throw new BadRequestException('Post content exceeds 256 characters');
        }

        const author = await this.userRepository.findOneBy({ username });
        if (!author) throw new NotFoundException('User not registered');

        const post = this.postRepository.create({ author, content });
        const savedPost = await this.postRepository.save(post);

        return plainToInstance(CreatePostResponseDto, {
            ...savedPost,
            author: author.username,
        });
    }

    async likePost(postId: number, username: string): Promise<PostLikeResponseDto> {
        const post = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['likedBy', 'author'],
        });
        if (!post) throw new NotFoundException('Post not found');

        const user = await this.userRepository.findOneBy({ username });
        if (!user) throw new NotFoundException('User not found');

        const alreadyLiked = post.likedBy.some(u => u.id === user.id);
        if (alreadyLiked) throw new BadRequestException('User already liked this post');

        post.likedBy.push(user);
        const updatedPost = await this.postRepository.save(post);

        return plainToInstance(PostLikeResponseDto, {
            ...updatedPost,
            author: post.author.username,
            likedBy: updatedPost.likedBy.map(u => u.username), 
        }, { excludeExtraneousValues: true });
    }

    async getAllPosts(): Promise<PostResponseDto[]> {
        const posts = await this.postRepository.find({
            relations: ['author', 'likedBy'],
            order: { createdAt: 'DESC' },
        });

        return posts.map(post =>
            plainToInstance(PostResponseDto, {
                ...post,
                author: post.author.username,
                likedBy: post.likedBy.map(u => u.username),
            }, { excludeExtraneousValues: true }),
        );
    }

    async getPostsByUsername(username: string): Promise<PostByUserResponseDto[]> {
        const posts = await this.postRepository.find({
            where: {
                author: { username },
            },
            relations: ['author', 'likedBy'],
            order: { createdAt: 'DESC' },
        });

        return posts.map(post =>
            plainToInstance(PostByUserResponseDto, {
                ...post,
                likedBy: post.likedBy.map(u => u.username),
            }, { excludeExtraneousValues: true }),
        );
    }
}
