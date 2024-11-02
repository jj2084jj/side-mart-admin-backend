import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Mart } from 'src/marts/entities/mart.entity';
import { Image } from './entities/image.entity';
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

  async saveImage(file: Express.Multer.File, postId: number) {
    // 1. S3에 이미지 업로드
    
    const imageResult = await this.awsService.uploadFile(file);

    // 2. 이미지 정보 DB 저장
    const image = this.imageRepository.create({
      url: imageResult.url,
      post: { id: postId }
    });

    return await this.imageRepository.save(image);
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const mart = await this.martRepository.findOne({
      where: { id: createPostDto.martId },
    });

    if (!mart) {
      throw new NotFoundException(`마트 정보 오류`);
    }

    const post = this.postRepository.create({
      mart,
      startDate: createPostDto.startDate,
      endDate: createPostDto.endDate
    });

    const savedPost = await this.postRepository.save(post);

    // 이미지 생성
    const images = createPostDto.images.map((imageDto) => {
      const image = this.imageRepository.create({
        url: imageDto.url,
        post: savedPost,
      });
      return image;
    });

    await this.imageRepository.save(images);

    return savedPost;
  }

  async findAll(martId: number) {
    return this.postRepository.find({
      where: {
        mart: { id: martId }
      },
      relations: ['images', 'mart'], // 관련 데이터도 함께 로드
      order: {
        createdDate: 'DESC' // 최신순 정렬
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
