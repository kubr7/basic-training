import { Exclude, Expose } from 'class-transformer';

export class UserFriendDto {
    @Expose()
    id: number;

    @Expose()
    username: string;
}