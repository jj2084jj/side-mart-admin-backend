import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MartsService } from './marts.service';
import { CreateMartDto } from './dto/create-mart.dto';
import { UpdateMartDto } from './dto/update-mart.dto';

@Controller('marts')
export class MartsController {
  constructor(private readonly martsService: MartsService) {}

  @Post()
  create(@Body() createMartDto: CreateMartDto) {
    return this.martsService.create(createMartDto);
  }

  @Get()
  findAll() {
    return this.martsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.martsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMartDto: UpdateMartDto) {
    return this.martsService.update(+id, updateMartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.martsService.remove(+id);
  }
}
