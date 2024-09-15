import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number; // post 고유 id
  @Column()
  martId: number; // Mart id
  @Column('blob', { nullable: true })
  image: Buffer; // BLOB 타입으로 변경
  @Column()
  startDate: string; // 전단 시작날짜
  @Column()
  endDate: string; // 전단 종료날짜
  @Column()
  createDate?: string; // 생성날짜
  @Column()
  key: string; // s3 키?
}
