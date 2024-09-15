import { Injectable } from '@nestjs/common';
import { CreateMartDto } from './dto/create-mart.dto';
import { UpdateMartDto } from './dto/update-mart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mart } from './entities/mart.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MartsService {
  // 구조 선언?
  constructor(
    // 마트 구조 반환
    @InjectRepository(Mart)
    private readonly martRepository: Repository<Mart>,
  ) {}

  create(createMartDto: CreateMartDto) {
    return 'This action adds a new mart';
  }

  findAll() {
    return `This action returns all marts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mart`;
  }

  update(id: number, updateMartDto: UpdateMartDto) {
    return `This action updates a #${id} mart`;
  }

  remove(id: number) {
    return `This action removes a #${id} mart`;
  }
}
