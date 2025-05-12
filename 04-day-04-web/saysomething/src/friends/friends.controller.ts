// src/friends/friends.controller.ts
import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) { }

    @Post('request/:receiverUsername')
    async sendFriendRequest(
        @Param('receiverUsername') receiverUsername: string,
        @Body('senderUsername') senderUsername: string,
    ) {
        return this.friendsService.sendFriendRequest(senderUsername, receiverUsername);
    }

    @Post('accept/:senderUsername')
    async acceptFriendRequest(
        @Param('senderUsername') senderUsername: string,
        @Body('receiverUsername') receiverUsername: string,
    ) {
        return this.friendsService.acceptFriendRequest(senderUsername, receiverUsername);
    }

    @Post('reject/:senderUsername')
    async rejectFriendRequest(
        @Param('senderUsername') senderUsername: string,
        @Body('receiverUsername') receiverUsername: string,
    ) {
        return this.friendsService.rejectFriendRequest(senderUsername, receiverUsername);
    }

    @Get('friend-requests/:username')
    async getFriendRequests(@Param('username') username: string) {
        return this.friendsService.getFriendRequests(username);
    }

    @Get('friends/:username')
    async getFriends(@Param('username') username: string) {
        return this.friendsService.getFriends(username);
    }
}