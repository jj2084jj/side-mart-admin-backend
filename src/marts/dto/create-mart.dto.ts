import { IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateMartDto {
  @IsString()
  name: string; // 마트 명

  @IsString()
  tel: string; // 전화번호

  @IsString()
  closed: string; // 휴무일

  @IsString()
  homepage: string; // 홈페이지

  @IsString()
  hours: string; // 영업시간

  @IsString()
  description: string; // 비고

  @Column('simple-array')
  files: string[];

  readonly status: string = '1'; // 기본 값으로 '1' 설정
}
