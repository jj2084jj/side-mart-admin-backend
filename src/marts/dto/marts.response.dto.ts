import { Mart } from '../entities/mart.entity';

export interface MartsResponse {
  data: Mart[];
  length: number;
  page: number;
  code: string;
}
