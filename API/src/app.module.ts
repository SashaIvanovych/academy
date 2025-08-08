import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IvanovychTestModule } from './ivanovych-test/ivanovych-test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'root',
      password: 'admin',
      database: 'academy',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IvanovychTestModule,
    AuthModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
