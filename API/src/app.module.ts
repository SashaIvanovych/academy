import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IvanovychTestModule } from './ivanovych-test/ivanovych-test.module';

@Module({
  imports: [IvanovychTestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
