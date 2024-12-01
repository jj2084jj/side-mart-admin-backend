import { IsString, IsOptional } from 'class-validator';

export class CreateMartDto {
  @IsString()
  name: string; // 마트 명

  @IsString()
  tel: string; // 전화번호

  @IsString()
  closed: string; // 휴무일

  @IsString()
  @IsOptional()
  homepage: string; // 홈페이지

  @IsString()
  hours: string; // 영업시간

  @IsString()
  @IsOptional()
  description: string; // 비고

  @IsString()
  @IsOptional()
  logoColorCode: string; // 로고 컬러 코드

  readonly status: string = '1'; // 기본 값으로 '1' 설정
}
