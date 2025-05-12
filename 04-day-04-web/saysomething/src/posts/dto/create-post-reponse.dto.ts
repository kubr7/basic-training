// src/posts/dto/create-post-reponse.dto.ts
import { Expose } from "class-transformer";

export class CreatePostResponseDto {
    @Expose()
    id: number;

    @Expose()
    content: string;

    @Expose()
    author: string;

    @Expose()
    createdAt: Date;

}