import {
  IsArray,
  isArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsNull } from 'typeorm';

export class CreatePostDto {
  @IsNotEmpty()
  martId: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional() // optional로 설정
  @IsArray() // 배열 형태로 설정
  images?: string[]; // 해당 필드를 선택적으로 추가
}
