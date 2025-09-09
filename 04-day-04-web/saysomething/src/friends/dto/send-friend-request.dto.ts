// src/friends/dto/send-friend-request.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
export class SendFriendRequestDto {
    @ApiProperty({
        description: 'The username of the sender',
        example: 'sunil_gavaskar'
    })
    @IsNotEmpty({ message: 'Sender username is required' })
    @IsString()
    @Expose()
    senderUsername: string;
}
