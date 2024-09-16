import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Mart {
  @PrimaryGeneratedColumn()
  id: number; // id

  @Column({ default: '1' }) // 기본값을 '1'로 설정
  status: string; // 상태

  @Column()
  name: string; // 마트 명

  @Column()
  tel: string; // 전화번호

  @Column()
  closed: string; // 휴무일

  @Column({ nullable: true })
  homepage: string; // 홈페이지

  @Column()
  hours: string; // 영업시간

  @Column({ nullable: true })
  description: string; // 비고

  @CreateDateColumn()
  createdDate: Date; // 생성일

  @UpdateDateColumn()
  updatedDate: Date; // 생성일

  // 포스트 정보
  @OneToMany(() => Post, (post) => post.mart)
  posts: Post[];
}
