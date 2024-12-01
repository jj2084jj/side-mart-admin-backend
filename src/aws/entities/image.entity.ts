import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Mart } from 'src/marts/entities/mart.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column()
  url: string; // 이미지 URL

  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  postId?: number; // 포스트와 연결

  @ManyToOne(() => Mart, (mart) => mart.images, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  martId?: number; // 마트와 연결
}
