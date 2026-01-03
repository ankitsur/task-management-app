import { TaskStatus, TaskPriority } from '../../createTask/contract';

/**
 * Response DTO for GET Task by ID
 */
export class GetTaskByIdResponseDto {
  id!: string;
  title!: string;
  description?: string;
  status!: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  createdAt!: string;
  updatedAt!: string;
}
