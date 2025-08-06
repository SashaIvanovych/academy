import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Controller for handling authentication-related endpoints.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   * @param dto - Data transfer object containing email and password.
   * @returns Standardized response with user data.
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: user,
      error: null,
    };
  }

  /**
   * Log in a user and return access and refresh tokens.
   * @param dto - Data transfer object containing email and password.
   * @returns Standardized response with tokens and user ID.
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.email, dto.password);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data: result,
      error: null,
    };
  }

  /**
   * Refresh access and refresh tokens.
   * @param dto - Data transfer object containing refresh token.
   * @returns Standardized response with new tokens.
   */
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(dto.refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens refreshed successfully',
      data: tokens,
      error: null,
    };
  }

  /**
   * Log out a user by clearing their refresh token.
   * @param req - Request object containing user data from JWT.
   * @returns Standardized response indicating logout success.
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Logout successful',
      data: null,
      error: null,
    };
  }

  /**
   * Get the authenticated user's profile.
   * @param req - Request object containing user data from JWT.
   * @returns Standardized response with user profile data.
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile retrieved successfully',
      data: req.user,
      error: null,
    };
  }
}
