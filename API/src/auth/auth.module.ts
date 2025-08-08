import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { createUserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

const JWT_SECRET_DEFAULT = 'my_secure_jwt_secret_12345';
const ACCESS_TOKEN_EXPIRES_IN = '15m';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || JWT_SECRET_DEFAULT,
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshJwtStrategy,
    JwtAuthGuard,
    {
      provide: 'UserRepository',
      useFactory: (dataSource: DataSource) => createUserRepository(dataSource),
      inject: [DataSource],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
