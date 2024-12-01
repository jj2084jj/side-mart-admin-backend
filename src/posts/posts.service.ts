import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Mart } from 'src/marts/entities/mart.entity';
import { Image } from '../aws/entities/image.entity';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class PostsService {
  // 구조 선언
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Mart)
    private readonly martRepository: Repository<Mart>,
    private readonly awsService: AwsService,
  ) {}

  /**
   * 마트 전단정보 생성
   * @param createPostDto
   * @param files // 전단이미지들
   * @returns
   */
  async create(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
  ): Promise<Post> {
    try {
      const mart = await this.martRepository.findOne({
        where: { id: createPostDto.martId },
      });

      if (!mart) {
        throw new NotFoundException(`해당 마트가 존재하지 않습니다.`);
      }

      // 1. Post 생성
      const post = this.postRepository.create({
        mart,
        startDate: createPostDto.startDate,
        endDate: createPostDto.endDate,
      });

      const savedPost = await this.postRepository.save(post);

      // 2. 이미지 업로드 및 저장
      if (files && files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const uploadResult = await this.awsService.uploadFile(file);
          const image = this.imageRepository.create({
            url: uploadResult.url,
            postId: savedPost.id,
          });
          return this.imageRepository.save(image);
        });

        await Promise.all(uploadPromises);
      }

      return savedPost;
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  /**
   * 마트id에 따른 전단정보 전체조회
   * @param martId
   * @returns
   */
  async findAll(martId: number) {
    return this.postRepository.find({
      where: {
        mart: { id: martId },
      },
      relations: { images: true, mart: true }, // 관련 데이터도 함께 로드
      order: {
        createdDate: 'DESC', // 최신순 정렬
      },
    });
  }

  /**
   * 포스트 개별조회
   * @param postId
   * @returns
   */
  async findOne(postId: number) {
    const posts = await this.postRepository.find({
      where: { id: postId },
      relations: { images: true },
      order: {
        createdDate: 'DESC', // 최신순 정렬
      },
    });

    if (!posts) {
      throw new NotFoundException('Post 가 존재하지 않습니다.');
    }

    return { data: posts };
  }

  /**
   * 포스트 업데이트
   * @param id 전단 id
   * @param updatePostDto 업데이트 정보
   * @returns
   */
  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.preload({
      id,
      ...updatePostDto,
    });

    if (!post) {
      throw new NotFoundException(
        `해당하는 포스트가 존재하지 않습니다. id: ${id}`,
      );
    }

    return this.martRepository.save(post);
  }

  /**
   * 포스트 삭제
   * @param postId
   */
  async delete(postId: number) {
    try {
      await this.imageRepository.delete({ postId });

      const result = await this.postRepository.delete(postId);
      if (result.affected === 0) {
        throw new NotFoundException(`해당하는 포스트 값이 존재하지 않습니다.`);
      }
    } catch (error) {
      console.log('포스트 삭제 실패:', error);
      throw error;
    }
  }
}
