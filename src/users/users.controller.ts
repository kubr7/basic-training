import { Controller, Post, Param, Body, Get } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Post('request/:receiverId')
  async sendFriendRequest(
    @Param('receiverId') receiverId: number,
    @Body('senderId') senderId: number,
  ) {
    return this.userService.sendFriendRequest(senderId, receiverId);
  }

  @Post('accept/:senderId')
  async acceptFriendRequest(
    @Param('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
  ) {
    return this.userService.acceptFriendRequest(senderId, receiverId);
  }

  @Post('reject/:senderId')
  async rejectFriendRequest(
    @Param('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
  ) {
    return this.userService.rejectFriendRequest(senderId, receiverId);
  }
}
