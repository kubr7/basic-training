import { Expose, Transform } from 'class-transformer';

export class GetAllUsersDto {
    @Expose()
    id: number;

    @Expose()
    @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
    name: string;
}