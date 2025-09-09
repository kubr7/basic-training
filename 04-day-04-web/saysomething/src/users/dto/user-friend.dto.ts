import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserFriendDto {
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
}