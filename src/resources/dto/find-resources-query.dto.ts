import { IsIn, IsOptional } from 'class-validator';
import {
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
  type ResourceStatus,
  type ResourceType,
} from '../resource.model';

export class FindResourcesQueryDto {
  @IsOptional()
  @IsIn(RESOURCE_TYPES)
  type?: ResourceType;

  @IsOptional()
  @IsIn(RESOURCE_STATUSES)
  status?: ResourceStatus;
}
