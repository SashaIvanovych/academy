import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UserRepositoryType } from './user.repository';

const ACCESS_TOKEN_EXPIRES_IN = '1m';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepositoryType,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    return this.userRepository.register(email, password);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.userRepository.saveRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      id: user.id,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userRepository.findByRefreshToken(refreshToken);
      if (!user || !payload) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });

      await this.userRepository.saveRefreshToken(user.id, newRefreshToken);

      return { access_token: accessToken, refresh_token: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userRepository.clearRefreshToken(userId);
  }
}
