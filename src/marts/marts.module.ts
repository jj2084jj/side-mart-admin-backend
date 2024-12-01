import { Module } from '@nestjs/common';
import { MartsService } from './marts.service';
import { MartsController } from './marts.controller';
import { Mart } from './entities/mart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { AwsModule } from 'src/aws/aws.module';
import { Image } from 'src/aws/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mart, Post, Image]), AwsModule],
  providers: [MartsService],
  controllers: [MartsController],
  exports: [MartsService],
})
export class MartsModule {}
