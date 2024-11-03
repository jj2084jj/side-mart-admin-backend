import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMartDto } from './dto/create-mart.dto';
import { UpdateMartDto } from './dto/update-mart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mart } from './entities/mart.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { Image } from 'src/posts/entities/image.entity';

@Injectable()
export class MartsService {
  // 구조 선언?
  constructor(
    // 마트 구조 반환
    @InjectRepository(Mart)
    private readonly martRepository: Repository<Mart>,

    // 게시글 구조 반환
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(createMartDto: CreateMartDto): Promise<Mart> {
    const mart = this.martRepository.create({
      ...createMartDto,
      status: '1', // 고정된 값으로 설정
    });

    return this.martRepository.save(mart);
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ result: Mart[]; total: number }> {
    const [result, total] = await this.martRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { result, total };
  }

  async findOne(id: number): Promise<Mart> {
    const mart = await this.martRepository.findOne({
      where: { id },
    });

    const posts = await this.postRepository.find({
      where: {
        mart: { id: id }
      },
      relations: ['images'], // 관련 데이터도 함께 로드
      order: {
        createdDate: 'DESC' // 최신순 정렬
      }
    });

    if (!mart) {
      throw new NotFoundException(`Mart with ID ${id} not found`);
    }

    return { ...mart, posts:posts };
  }

  async update(id: number, updateMartDto: UpdateMartDto): Promise<Mart> {
    const mart = await this.martRepository.preload({
      id,
      ...updateMartDto,
    });

    if (!mart) {
      throw new NotFoundException(`Mart with ID ${id} not found`);
    }

    return this.martRepository.save(mart);
  }

  async updateStatus(id: number, status: string): Promise<{ message: string }> {
    const mart = await this.martRepository.findOne({ where: { id } });
    if (!mart) {
      throw new NotFoundException(`Mart with ID ${id} not found`);
    }

    mart.status = status; // 상태 업데이트
    await this.martRepository.save(mart);

    return { message: 'success' };
  }

  async delete(id: number): Promise<void> {
    try {
      await this.imageRepository.delete({ post: { mart: { id } } });

      await this.postRepository.delete({ mart: { id } });

      const result = await this.martRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`해당하는 마트 ${id}값이 존재하지 않습니다.`);
      }
    } catch (error) {
      console.log('마트 삭제 실패:', error);
      throw error;
    }
  }
}
