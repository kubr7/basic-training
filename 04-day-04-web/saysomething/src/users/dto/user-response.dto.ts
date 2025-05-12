// dtos/user-response.dto.ts
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Exclude()
    password: string;
}
