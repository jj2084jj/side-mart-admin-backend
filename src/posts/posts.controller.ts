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
  NotFoundException,
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

  /**
   * 포스트 정보 업데이트
   * @param id
   * @param updatePostDto
   * @returns
   */
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<{ message: string }> {
    try {
      await this.postsService.update(id, updatePostDto);
      return {
        message: `success`,
      };
    } catch (error) {
      throw new NotFoundException('업데이트에 실패했습니다.');
    }
  }

  /**
   * 포스트 개별 삭제
   * @param id
   * @returns
   */
  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      // 포스트 존재 확인
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException(`포스트 ID ${id}를 찾을 수 없습니다.`);
      }
      this.postsService.delete(id);
      return { message: `success` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(
        `포스트 삭제 중 오류가 발생했습니다: ${error.message}`,
      );
    }
  }
}
