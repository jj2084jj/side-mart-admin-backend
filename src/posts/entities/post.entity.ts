import { Mart } from 'src/marts/entities/mart.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number; // post 고유 id

  @ManyToOne(() => Mart, (mart) => mart.posts)
  mart: Mart; // 마트와 연결

  @Column()
  startDate: string; // 전단 시작날짜

  @Column()
  endDate: string; // 전단 종료날짜

  @OneToMany(() => Image, (image) => image.post)
  images: Image[]; // 이미지 배열

  @CreateDateColumn()
  createdDate: Date; // 생성날짜

  @UpdateDateColumn()
  updatedDate: Date; // 생성날짜
}
