import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  GetTasksQueryDto,
  GetTasksResponseDto,
  TaskListItemDto,
  TaskSortField,
} from '../contract';
import { Task } from 'src/modules/tasks/domain/task.entity';

/**
 * Map API sort field names to database column names
 */
const SORT_FIELD_MAP: Record<TaskSortField, string> = {
  title: 'task.title',
  status: 'task.status',
  priority: 'task.priority',
  dueDate: 'task.due_date',
  createdAt: 'task.created_at',
};

@Injectable()
export class GetTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(query: GetTasksQueryDto): Promise<GetTasksResponseDto> {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      sortBy,
      sortOrder = 'asc',
    } = query;

    const qb = this.taskRepository.createQueryBuilder('task');

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (priority) {
      qb.andWhere('task.priority = :priority', { priority });
    }

    if (search) {
      qb.andWhere('task.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    // Apply sorting
    if (sortBy && SORT_FIELD_MAP[sortBy]) {
      const sortColumn = SORT_FIELD_MAP[sortBy];
      const order = sortOrder.toUpperCase() as 'ASC' | 'DESC';

      // Handle NULL values for optional fields (priority, dueDate)
      // NULLS LAST for ASC, NULLS FIRST for DESC (so nulls are always at the end)
      if (sortBy === 'priority' || sortBy === 'dueDate') {
        qb.orderBy(sortColumn, order, order === 'ASC' ? 'NULLS LAST' : 'NULLS FIRST');
      } else {
        qb.orderBy(sortColumn, order);
      }
    } else {
      // Default sort by created_at DESC
      qb.orderBy('task.created_at', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [tasks, total] = await qb.getManyAndCount();

    const data: TaskListItemDto[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
}
