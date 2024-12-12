import { PartialType } from '@nestjs/mapped-types';
import { CreateMartDto } from './create-mart.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateMartDto extends PartialType(CreateMartDto) {}
