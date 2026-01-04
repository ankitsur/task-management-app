import { IsEnum, IsNumber, IsOptional, IsString, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '../../createTask/contract';

/**
 * Allowed sort fields for tasks
 */
export type TaskSortField = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt';

/**
 * Sort direction
 */
export type SortOrder = 'asc' | 'desc';

export class GetTasksQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['title', 'status', 'priority', 'dueDate', 'createdAt'])
  sortBy?: TaskSortField;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: SortOrder;
}

export class TaskListItemDto {
  id!: string;
  title!: string;
  description?: string;
  status!: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt!: string;
  updatedAt!: string;
}

export class GetTasksResponseDto {
  data!: TaskListItemDto[];
  meta!: {
    page: number;
    limit: number;
    total: number;
  };
}
