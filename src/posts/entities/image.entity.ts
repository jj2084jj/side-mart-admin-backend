import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  url: string; // 이미지 URL

  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: 'CASCADE'
  })
  post: Post; // 포스트와 연결
}
