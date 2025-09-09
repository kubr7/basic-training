// dtos/user-response.dto.ts
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: 'The id of the user',
        example: 1
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'The username of the user',
        example: 'pearl_harbor'
    })
    @Expose()
    username: string;

    @ApiProperty({
        description: 'The first name of the user',
        example: 'Pearl'
    })
    @Expose()
    firstName: string;

    @ApiProperty({
        description: 'The last name of the user',
        example: 'Harbor'
    })
    @Expose()
    lastName: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'pearl_harbor@gmail.com'
    })
    @Expose()
    email: string;

    @Exclude()
    password: string;
}
