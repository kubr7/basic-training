import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.createUser(email, hashedPassword);
        return this.generateJwt(user);
    }

    async login(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return this.generateJwt(user);
        }
        throw new Error('Invalid credentials');
    }

    generateJwt(user) {
        const payload: JwtPayload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
