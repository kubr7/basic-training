// src/auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'pearl_harbor'
    })
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;

    @ApiProperty({
        description: 'The first name of the user',
        example: 'Pearl'
    })
    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    firstName: string;

    @ApiProperty({
        description: 'The last name of the user',
        example: 'Harbor'
    })
    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    lastName: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'pearl_harbor@gmail.com'
    })
    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'Password123!'
    })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}/, {
        message:
            'Password must include uppercase, lowercase, number, and special character',
    })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}

export class LoginDto {
    @ApiProperty({
        description: 'The email or username of the user. You can use either email or username to login.',
        example: 'pearl_harbor@gmail.com OR pearl_harbor'
    })
    @IsNotEmpty({ message: 'Email or username is required' })
    @IsString({ message: 'identifier must be a string' })
    identifier: string;  // can be email or username

    @ApiProperty({
        description: 'The password of the user',
        example: 'Password123!'
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;
}

export class LogoutDto {
    @ApiProperty({
        description: 'The token of the user',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjshImVtYWlsIjoidmlyYXQua29obGlAZXhhbXBsZS8jb20iLCJ1c2VybmFtZSI6InZpcmF0X2tvaGxpIiwiaWF0IjoxNzQ2ODkyNTE4LCJleHAiOjE3NDY4OTYxMTh9.tta4t67wVW4YlSf5Kj3E86KpIUScyt8ooQIkwOWTKCE'
    })
    @IsNotEmpty({ message: 'Token is required' })
    @IsString()
    token: string;
}
