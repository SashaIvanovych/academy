import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/**
 * DTO for user registration.
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}

/**
 * DTO for user login.
 */
export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}

/**
 * DTO for token refresh.
 */
export class RefreshTokenDto {
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}
