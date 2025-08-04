import { Test, TestingModule } from '@nestjs/testing';
import { IvanovychTestController } from './ivanovych-test.controller';
import { IvanovychTestService } from './ivanovych-test.service';

describe('IvanovychTestController', () => {
  let controller: IvanovychTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IvanovychTestController],
      providers: [IvanovychTestService],
    }).compile();

    controller = module.get<IvanovychTestController>(IvanovychTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
