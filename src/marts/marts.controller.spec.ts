import { Test, TestingModule } from '@nestjs/testing';
import { MartsController } from './marts.controller';
import { MartsService } from './marts.service';

describe('MartsController', () => {
  let controller: MartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MartsController],
      providers: [MartsService],
    }).compile();

    controller = module.get<MartsController>(MartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
