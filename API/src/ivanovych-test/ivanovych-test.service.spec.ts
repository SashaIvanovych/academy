import { Test, TestingModule } from '@nestjs/testing';
import { IvanovychTestService } from './ivanovych-test.service';

describe('IvanovychTestService', () => {
  let service: IvanovychTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IvanovychTestService],
    }).compile();

    service = module.get<IvanovychTestService>(IvanovychTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
