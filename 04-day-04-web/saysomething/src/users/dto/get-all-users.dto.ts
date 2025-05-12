import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class GetAllUsersDto {
    @ApiProperty({
        description: 'The id of the user',
        example: 1
    })
    @Expose()
    id: number;

    @ApiProperty({
        description: 'The name of the user',
        example: 'Pearl Harbor'
    })
    @Expose()
    @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
    name: string;
}