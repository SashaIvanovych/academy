import { Controller } from '@nestjs/common';
import { IvanovychTestService } from './ivanovych-test.service';

@Controller('ivanovych-test')
export class IvanovychTestController {
  constructor(private readonly ivanovychTestService: IvanovychTestService) {}
}
