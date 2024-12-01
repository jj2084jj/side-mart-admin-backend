import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Mart } from 'src/marts/entities/mart.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number; // id - pk 자동으로 생성되는 key

  /**
   * aws에 저장된 이미지 url
   * 필수!
   */
  @Column()
  url: string; // 이미지 URL - (필수값)

  /**
   * 관계형 설정
   * post 와의 연결고리
   * 필수값 아님
   */
  @ManyToOne(() => Post, (post) => post.images, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  postId?: number; // 포스트와 연결

  @ManyToOne(() => Mart, (mart) => mart.images, {
    onDelete: 'CASCADE',
    nullable: true, // 필수값이 아닌경우
  })
  martId?: number; // 마트와 연결
}
