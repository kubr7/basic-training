// src/posts/dto/post-like-reponse.dto.ts
import { Expose, Type } from "class-transformer";

export class PostLikeResponseDto {
    @Expose()
    id: number;

    @Expose()
    content: string;

    @Expose()
    author: string;

    @Expose()
    @Type(() => String)
    likedBy: string[];

    @Expose()
    @Type(() => Date)
    createdAt: Date;
}
