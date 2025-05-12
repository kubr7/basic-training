// src/posts/dto/post-by-user-response.dto.ts
import { Expose, Type } from "class-transformer";

export class PostByUserResponseDto {
    @Expose()
    id: number;

    @Expose()
    content: string;

    @Expose()
    @Type(() => Date)
    createdAt: Date;

    @Expose()
    @Type(() => String)
    likedBy: string[];
}
