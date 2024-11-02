import { Module } from '@nestjs/common';
import { MartsService } from './marts.service';
import { MartsController } from './marts.controller';
import { Mart } from './entities/mart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mart,Post])],
  providers: [MartsService],
  controllers: [MartsController],
  exports: [MartsService],
})
export class MartsModule {}
