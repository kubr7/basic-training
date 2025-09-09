import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
export class LikePostDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'sunil_gavaskar'
    })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    @Expose()
    username: string;
}

