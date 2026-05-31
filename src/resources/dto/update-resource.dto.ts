import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
  type ResourceStatus,
  type ResourceType,
} from '../resource.model';

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsIn(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsIn(RESOURCE_STATUSES)
  status?: ResourceStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;
}
