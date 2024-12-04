import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMartDto } from './dto/create-mart.dto';
import { UpdateMartDto } from './dto/update-mart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mart } from './entities/mart.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { AwsService } from 'src/aws/aws.service';
import { Image } from 'src/aws/entities/image.entity';

@Injectable()
export class MartsService {
  // 사용할 구조 선언
  constructor(
    @InjectRepository(Mart)
    private readonly martRepository: Repository<Mart>,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    private readonly awsService: AwsService,
  ) {}

  // 마트 생성
  async create(
    createMartDto: CreateMartDto,
    files: Express.Multer.File[],
  ): Promise<Mart> {
    try {
      // 마트 생성
      const mart = this.martRepository.create({
        ...createMartDto,
        status: '1',
      });

      const saveMart = await this.martRepository.save(mart);

      // 추가 이미지들 업로드
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const uploadResult = await this.awsService.uploadFile(file);

          const image = this.imageRepository.create({
            url: uploadResult.url,
            martId: saveMart.id,
          });

          return this.imageRepository.save(image);
        });

        await Promise.all(uploadPromises);
      }

      return saveMart;
    } catch (error) {
      throw new Error(`마트 생성 중 오류 발생: ${error.message}`);
    }
  }

  /**
   * 마트리스트 전체조회
   * @param page 페이지 정보
   * @param pageSize 보여줄 총 페이지 정의
   * @returns
   */
  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ result: Mart[]; total: number }> {
    const [result, total] = await this.martRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: { images: true },
    });
    return { result, total };
  }

  /**
   * 마트 단일조회
   * @param id
   * @returns
   */
  async findOne(id: number): Promise<Mart> {
    const mart = await this.martRepository.findOne({
      where: { id },
      relations: {
        images: true,
      },
    });

    let posts = await this.postRepository.find({
      where: {
        mart: { id: id },
      },
      relations: { images: true },
      order: {
        createdDate: 'DESC', // 최신순 정렬
      },
    });

    // endDate가 현재 날짜 이후인 항목만 필터링
    const currentDate = new Date();
    posts = posts.filter((post) => {
      const endDate = post.endDate ? new Date(post.endDate) : null;
      return !endDate || endDate >= currentDate;
    });

    if (!mart) {
      throw new NotFoundException(
        `해당하는 마트가 존재하지 않습니다. id: ${id}`,
      );
    }

    return { ...mart, posts: posts };
  }

  /**
   * 마트 기본정보 변경
   * @param id
   * @param updateMartDto
   * @returns
   */
  async update(id: number, updateMartDto: UpdateMartDto): Promise<Mart> {
    const mart = await this.martRepository.preload({
      id,
      ...updateMartDto,
    });

    if (!mart) {
      throw new NotFoundException(
        `해당하는 마트가 존재하지 않습니다. id: ${id}`,
      );
    }

    return this.martRepository.save(mart);
  }

  /**
   * 마트 활성상태 변경
   * @param id
   * @param status
   * @returns
   */
  async updateStatus(id: number, status: string): Promise<{ message: string }> {
    const mart = await this.martRepository.findOne({ where: { id } });
    if (!mart) {
      throw new NotFoundException(
        `해당하는 마트가 존재하지 않습니다. id: ${id}`,
      );
    }

    mart.status = status; // 상태 업데이트
    await this.martRepository.save(mart);

    return { message: 'success' };
  }

  /**
   * 마트 삭제
   * @param martId
   */
  async delete(martId: number): Promise<void> {
    try {
      await this.imageRepository.delete({ martId });

      await this.postRepository.delete({ mart: { id: martId } });

      const result = await this.martRepository.delete(martId);
      if (result.affected === 0) {
        throw new NotFoundException(
          `해당하는 마트 ${martId}값이 존재하지 않습니다.`,
        );
      }
    } catch (error) {
      console.log('마트 삭제 실패:', error);
      throw error;
    }
  }
}
