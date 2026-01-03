import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';

import { TaskStatus, TaskPriority } from '../../createTask/contract';

/**
 * Request DTO for updating a task
 */
export class UpdateTaskRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

/**
 * Response DTO for updated task
 */
export class UpdateTaskResponseDto {
  id!: string;
  title!: string;
  description?: string;
  status!: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt!: string;
  updatedAt!: string;
}
