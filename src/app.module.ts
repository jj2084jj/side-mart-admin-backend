import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MartsModule } from './marts/marts.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Post } from './posts/entities/post.entity';
import { Mart } from './marts/entities/mart.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Jin&Jo1125',
      database: 'martdb',
      entities: [Mart, Post], // 엔티티 클래스 배열
      synchronize: true, // 개발환경에서만 사용
      autoLoadEntities: true, // 엔티티 자동 로드
    }),
    MartsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
