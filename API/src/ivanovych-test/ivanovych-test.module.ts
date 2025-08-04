import { Module } from '@nestjs/common';
import { IvanovychTestService } from './ivanovych-test.service';
import { IvanovychTestController } from './ivanovych-test.controller';

@Module({
  controllers: [IvanovychTestController],
  // providers: [IvanovychTestService],
  providers: [IvanovychTestService],
})
export class IvanovychTestModule {}
