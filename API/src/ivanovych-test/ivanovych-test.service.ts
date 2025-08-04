import { Injectable } from '@nestjs/common';

@Injectable()
export class IvanovychTestService {
  returnHello() {
    return { message: 'Hello' };
  }
}
