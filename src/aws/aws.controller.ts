import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from './aws.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const fileKey = uuidv4();
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    try {
      const result = await this.awsService.uploadFile(file);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}