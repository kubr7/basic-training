// src/posts/dto/post-response.dto.ts
import { Expose, Type } from 'class-transformer';

export class PostResponseDto {
    @Expose()
    id: number;

    @Expose()
    content: string;

    @Expose()
    author: string;

    @Expose()
    @Type(() => Date)
    createdAt: Date;

    @Expose()
    @Type(() => String)
    likedBy: string[];
}
