import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MartsModule } from './marts/marts.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Post } from './posts/entities/post.entity';
import { Mart } from './marts/entities/mart.entity';
import { AwsModule } from './aws/aws.module';
import { AwsService } from './aws/aws.service';
import { Image } from './aws/entities/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/config/env/.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        return {
          type: 'mariadb',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT, 10),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
          entities: [Mart, Post, Image],
          synchronize: true,
          autoLoadEntities: true,
          connectTimeout: 10000,
        };
      },
    }),
    MartsModule,
    PostsModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AwsService],
})
export class AppModule {}
