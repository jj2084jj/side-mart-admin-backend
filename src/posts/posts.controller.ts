import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 전단 단독 조회
   * @param id
   * @returns
   */
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  /**
   * 이미지 업로드
   * @param postId
   * @param file
   * @returns
   */
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') postId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.postsService.saveImage(file, postId);
  }

  /**
   * 전단정보 생성
   * @param createPostDto
   * @param files
   * @returns
   */
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      return await this.postsService.create(createPostDto, files);
    } catch (error) {
      console.error('Post creation error:', error);
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(+id);
  }
}
