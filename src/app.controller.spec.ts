import { Mart } from './marts/entities/mart.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a Mart object', () => {
      const expectedMart: Mart = {
        id: 1,
        status: '0',
        name: '이마트 애브리데이',
        tel: '010-222-2222',
        closed: '매주 둘째주 일요일 휴무',
        homepage: '홈페이지',
        hours: 'ㅇㅇ',
        posts: [],
        description: '',
        images: [],
        logoColorCode: '', // 추가
        createdDate: new Date(), // 수정된 날짜 객체
        updatedDate: new Date(), // 수정된 날짜 객체
      };

      // `appController.getList()`의 반환값과 `expectedMart`를 비교
      expect(appController.getList()).toEqual(expectedMart);
    });
  });
});
