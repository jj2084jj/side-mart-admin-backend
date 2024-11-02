import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MartsService } from './marts.service';
import { CreateMartDto } from './dto/create-mart.dto';
import { UpdateMartDto } from './dto/update-mart.dto';
import { Mart } from './entities/mart.entity';
import { MartsResponse } from './dto/marts.response.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('marts')
export class MartsController {
  constructor(private readonly martsService: MartsService) {}

  // 마트 생성
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createMartDto: CreateMartDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const fileUrls = files.map((file) => `/uploads/${file.filename}`); // 예: 파일 저장 경로 배열

    // DTO에 파일 경로 배열 추가
    const martData = { ...createMartDto, files: fileUrls };

    return this.martsService.create(martData);
  }

  // 리스트 조회
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<MartsResponse> {
    const { result: martList, total } = await this.martsService.findAll(
      page,
      pageSize,
    );

    return {
      data: martList,
      length: total,
      page: page,
      code: '200',
    };
  }

  // 단일 조회
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Mart> {
    return this.martsService.findOne(id);
  }

  // 업데이트
  @Patch(':id')
  @HttpCode(HttpStatus.OK) // HTTP 상태 코드를 200으로 설정
  async update(
    @Param('id') id: number,
    @Body() updateMartDto: UpdateMartDto,
  ): Promise<{ message: string }> {
    try {
      await this.martsService.update(id, updateMartDto);
      return {
        message: `success`,
      };
    } catch (error) {
      throw new NotFoundException('업데이트에 실패했습니다.');
    }
  }

  // 상태만 업데이트
  @Patch(':id/status/:status')
  @HttpCode(HttpStatus.OK) // HTTP 상태 코드를 200으로 설정
  async updateStatus(
    @Param('id') id: number,
    @Param('status') status: string,
  ): Promise<{ message: string }> {
    try {
      const result = await this.martsService.updateStatus(id, status);
      if (!result) {
        throw new NotFoundException('마트를 찾을 수 없습니다.');
      }
      return {
        message: '성공적으로 상태를 업데이트했습니다.',
      };
    } catch (error) {
      throw new NotFoundException('업데이트에 실패했습니다.');
    }
  }

  // 삭제
  @Delete(':id')
  @HttpCode(HttpStatus.OK) // HTTP 상태 코드를 200으로 설정
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    try {
      await this.martsService.delete(id);
      return { message: `success` };
    } catch (error) {
      throw new NotFoundException(`삭제에 실패하였습니다. 다시 확인해주세요.`);
    }
  }
}
