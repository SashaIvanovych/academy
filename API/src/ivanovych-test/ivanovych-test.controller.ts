import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { IvanovychTestService } from './ivanovych-test.service';
import { CreateDataDto } from './dto/create-data.dto';

@Controller('ivanovych-test')
export class IvanovychTestController {
  constructor(private readonly ivanovychTestService: IvanovychTestService) {}

  @Get('returnHello')
  returnHello() {
    return this.ivanovychTestService.returnHello();
  }

  @Get('getData')
  getData() {
    return this.ivanovychTestService.getData();
  }

  @Get('getDataById/:id')
  getDataById(@Param('id') id: string) {
    return this.ivanovychTestService.getDataById(Number(id));
  }

  @Post('createData')
  createData(@Body() createDataDto: CreateDataDto) {
    return this.ivanovychTestService.createData(createDataDto);
  }
}
