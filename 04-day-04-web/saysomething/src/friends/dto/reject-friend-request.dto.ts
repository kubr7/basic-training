import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RejectFriendRequestDto {
    @ApiProperty({
        description: 'The username of the receiver',
        example: 'sunil_gavaskar'
    })
    @IsNotEmpty({ message: 'Receiver username is required' })
    @IsString()
    @Expose()
    receiverUsername: string;
}