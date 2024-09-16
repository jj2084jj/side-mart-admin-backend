import { Injectable } from '@nestjs/common';
import { Mart } from './marts/entities/mart.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getList(): Mart {
    return {
      posts: [],
      id: 1,
      status: '0',
      name: '이마트 애브리데이',
      tel: '010-222-2222',
      closed: '매주 둘째주 일요일 휴무',
      homepage: '홈페이지',
      hours: 'ㅇㅇ',
      description: '',
      createdDate: new Date(), // 현재 시간을 설정
      updatedDate: new Date(),
    };
  }
}
