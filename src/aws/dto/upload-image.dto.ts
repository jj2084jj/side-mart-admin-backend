import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class uploadImageDto {
  @IsString()
  @IsNotEmpty()
  key: string; // S3에 업로드될 파일 키

  @IsNotEmpty()
  file: string; // 업로드할 파일 데이터
}
