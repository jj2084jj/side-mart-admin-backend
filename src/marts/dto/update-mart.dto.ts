import { PartialType } from '@nestjs/mapped-types';
import { CreateMartDto } from './create-mart.dto';

export class UpdateMartDto extends PartialType(CreateMartDto) {}
