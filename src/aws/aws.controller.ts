import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    try {
      const key = `images/${Date.now()}_${file.originalname}`;
      const imageUrl = await this.awsService.uploadFile(key, file.buffer);
      
      return {
        success: true,
        imageUrl,
        key
      };
    } catch (error) {
      return {
        success: false,
        message: '이미지 업로드에 실패했습니다.',
        error: error.message,
      };
    }
  }
}