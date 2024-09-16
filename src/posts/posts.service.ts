import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Mart } from 'src/marts/entities/mart.entity';
import { Image } from './entities/image.entity';

@Injectable()
export class PostsService {
  // 구조 선언?
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Mart)
    private readonly martRepository: Repository<Mart>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const mart = await this.martRepository.findOne({
      where: { id: createPostDto.martId },
    });

    if (!mart) {
      throw new NotFoundException(`마트 정보 오류`);
    }

    const post = this.postRepository.create({
      mart,
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

  findAll() {
    return `This action returns all posts`;
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
