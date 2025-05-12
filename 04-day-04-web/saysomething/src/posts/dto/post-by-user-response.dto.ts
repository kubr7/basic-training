// src/posts/dto/post-by-user-response.dto.ts
import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PostByUserResponseDto {
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

    @ApiProperty({
        description: 'The created at date of the post',
        example: '2021-01-01'
    })
    @Expose()
    @Type(() => Date)
    createdAt: Date;

    @ApiProperty({
        description: 'The users who liked the post',
        example: ['John Doe', 'Jane Doe']
    })
    @Expose()
    @Type(() => String)
    likedBy: string[];
}
