// src/auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'Username is required' })
    @IsString()
    username: string;

    @IsNotEmpty({ message: 'First name is required' })
    @IsString()
    firstName: string;

    @IsNotEmpty({ message: 'Last name is required' })
    @IsString()
    lastName: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}/, {
        message:
            'Password must include uppercase, lowercase, number, and special character',
    })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}

export class LoginDto {
    @IsNotEmpty({ message: 'Email or username is required' })
    @IsString({ message: 'identifier must be a string' })
    identifier: string;  // can be email or username

    @IsNotEmpty({ message: 'Password is required' })
    @IsString()
    password: string;
}

export class LogoutDto {
    @IsNotEmpty({ message: 'Token is required' })
    @IsString()
    token: string;
}
