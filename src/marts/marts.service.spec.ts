import { Test, TestingModule } from '@nestjs/testing';
import { MartsService } from './marts.service';

describe('MartsService', () => {
  let service: MartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MartsService],
    }).compile();

    service = module.get<MartsService>(MartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
