import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";


export class CreatePostDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'Sunil Gavaskar'
    })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    @Expose()
    username: string;

    @ApiProperty({
        description: 'The content of the post',
        example: 'I am a cricket fan'
    })
    @IsNotEmpty({ message: 'Content is required' })
    @IsString()
    @Expose()
    content: string;
}