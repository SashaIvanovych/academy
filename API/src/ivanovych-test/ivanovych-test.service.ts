import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDataDto } from './dto/create-data.dto';

@Injectable()
export class IvanovychTestService {
  private data = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ];
  returnHello() {
    return { message: 'Hello' };
  }

  getData() {
    return this.data;
  }

  getDataById(id: number) {
    const result = this.data.find((item) => item.id === id);
    if (!result) throw new NotFoundException();
    return result;
  }

  createData(createDataDto: CreateDataDto) {
    const newData = {
      id: this.data.length + 1,
      name: createDataDto.name,
    };
    this.data.push(newData);
    return this.data;
  }
}
