import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  martId: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}
