import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from './create-image.dto';

export class CreatePostDto {
  @IsNotEmpty()
  martId: number; // Mart id

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images: CreateImageDto[]; // 이미지 배열

  @IsString()
  startDate: string; // 전단 시작날짜

  @IsString()
  endDate: string; // 전단 종료날짜
}
