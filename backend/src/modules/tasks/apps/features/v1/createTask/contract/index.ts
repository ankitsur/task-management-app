import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';

/**
 * API-level Task Status
 * (kept in contract layer intentionally)
 */
export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * API-level Task Priority
 */
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/**
 * Request DTO for creating a task
 */
export class CreateTaskRequestDto {
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
 * Response DTO for created task
 */
export class CreateTaskResponseDto {
  id!: string;
  title!: string;
  description?: string;
  status!: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt!: string;
  updatedAt!: string;
}
