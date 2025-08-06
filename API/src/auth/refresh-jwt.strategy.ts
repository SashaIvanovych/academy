import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

const JWT_SECRET_DEFAULT = 'my_secure_jwt_secret_12345';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey:
        configService.get<string>('JWT_SECRET') || JWT_SECRET_DEFAULT,
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
