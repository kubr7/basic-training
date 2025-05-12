// src/posts/dto/create-post-reponse.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreatePostResponseDto {
    @ApiProperty({
        description: 'The id of the post',
        example: 1
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'The content of the post',
        example: 'This is a test post'
    })
    @Expose()
    content: string;

    @Expose()
    author: string;

    @ApiProperty({
        description: 'The created at date of the post',
        example: '2021-01-01'
    })
    @Expose()
    createdAt: Date;

}