// src/friends/friends.controller.ts
import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import { SendFriendRequestDto } from './dto/send-friend-request.dto';
import { AcceptFriendRequestDto } from './dto/accept-friend-request.dto';
import { RejectFriendRequestDto } from './dto/reject-friend-request.dto';

@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) { }

    @Post('request/:receiverUsername')
    @ApiOperation({ summary: 'Send a friend request' })
    @ApiParam({ name: 'receiverUsername', type: String })
    @ApiBody({ type: SendFriendRequestDto })
    @ApiCreatedResponse({ description: 'Friend request sent successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async sendFriendRequest(
        @Param('receiverUsername') receiverUsername: string,
        @Body('senderUsername') senderUsername: string,
    ) {
        return this.friendsService.sendFriendRequest(senderUsername, receiverUsername);
    }

    @Post('accept/:senderUsername')
    @ApiOperation({ summary: 'Accept a friend request' })
    @ApiParam({ name: 'senderUsername', type: String })
    @ApiBody({ type: AcceptFriendRequestDto })
    @ApiCreatedResponse({ description: 'Friend request accepted successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async acceptFriendRequest(
        @Param('senderUsername') senderUsername: string,
        @Body('receiverUsername') receiverUsername: string,
    ) {
        return this.friendsService.acceptFriendRequest(senderUsername, receiverUsername);
    }

    @Post('reject/:senderUsername')
    @ApiOperation({ summary: 'Reject a friend request' })
    @ApiParam({ name: 'senderUsername', type: String })
    @ApiBody({ type: RejectFriendRequestDto })
    @ApiCreatedResponse({ description: 'Friend request rejected successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async rejectFriendRequest(
        @Param('senderUsername') senderUsername: string,
        @Body('receiverUsername') receiverUsername: string,
    ) {
        return this.friendsService.rejectFriendRequest(senderUsername, receiverUsername);
    }

    @Get('friend-requests/:username')
    @ApiOperation({ summary: 'Get friend requests' })
    @ApiParam({ name: 'username', type: String })
    @ApiCreatedResponse({ description: 'Friend requests retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async getFriendRequests(@Param('username') username: string) {
        return this.friendsService.getFriendRequests(username);
    }

    @Get('friends/:username')
    @ApiOperation({ summary: 'Get friends' })
    @ApiParam({ name: 'username', type: String })
    @ApiCreatedResponse({ description: 'Friends retrieved successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async getFriends(@Param('username') username: string) {
        return this.friendsService.getFriends(username);
    }
}