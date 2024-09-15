import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mart {
  @PrimaryGeneratedColumn()
  id: number; // id
  @Column()
  name: string; // 마트 명
  @Column()
  tel: string; // 전화번호
  @Column()
  closed: string; // 휴무일
  @Column()
  homepage: string; // 홈페이지
  @Column()
  hours: string; // 영업시간
  @Column()
  mome: string; // 비고
  @Column()
  createdDate: string; // 생성일
}
