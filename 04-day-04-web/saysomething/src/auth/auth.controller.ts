import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LogoutDto } from './dto/auth.dto';
import {
    ApiTags,ApiBody, 
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiBadRequestResponse
} from '@nestjs/swagger';

@ApiTags('Auth') // Organizes in Swagger UI
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiCreatedResponse({ description: 'User registered successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input data' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiOkResponse({ description: 'User logged in successfully' })
    @ApiBadRequestResponse({ description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('logout')
    @ApiOperation({ summary: 'Logout a user' })
    @ApiOkResponse({ description: 'User logged out successfully' })
    async logout(@Body() logoutDto: LogoutDto) {
        return this.authService.logout(logoutDto);
    }
}
