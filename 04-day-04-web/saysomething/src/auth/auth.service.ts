// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import { RegisterDto, LoginDto, LogoutDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {

        const existingUser = await this.userService.getUserByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('Email is already in use');
        }

        const usernameTaken = await this.userService.isUsernameTaken(registerDto.username);
        if (usernameTaken) {
            throw new BadRequestException('Username is already taken');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.userService.createUser(
            registerDto.username,
            registerDto.firstName,
            registerDto.lastName,
            registerDto.email,
            hashedPassword
        );
        return this.generateJwt(user);
    }

    // async login(email: string, password: string) {
    //     const user = await this.userService.findUserByEmail(email);
    //     if (user && await bcrypt.compare(password, user.password)) {
    //         return this.generateJwt(user);
    //     }
    //     throw new Error('Invalid credentials');
    // }

    async login(loginDto: LoginDto) {
        const isEmail = loginDto.identifier.includes('@');

        const user = isEmail
            ? await this.userService.getUserByEmail(loginDto.identifier)
            : await this.userService.getUserByUsername(loginDto.identifier);

        if (user && await bcrypt.compare(loginDto.password, user.password)) {
            return this.generateJwt(user);
        }

        throw new Error('Invalid credentials');
    }

    async logout(logoutDto: LogoutDto) {
        return { message: 'Logged out successfully', token: logoutDto.token };
    }


    generateJwt(user) {
        const payload: JwtPayload = { sub: user.id, email: user.email, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
