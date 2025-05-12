// dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'pearl_harbor'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'The first name of the user',
        example: 'Pearl'
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        description: 'The last name of the user',
        example: 'Harbor'
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'pearl_harbor@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'Password123!'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
