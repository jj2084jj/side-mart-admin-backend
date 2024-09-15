import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Mart } from './marts/entities/mart.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  getList(): Mart {
    return this.appService.getList();
  }
}
