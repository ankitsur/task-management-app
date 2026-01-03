import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  GetTasksQueryDto,
  GetTasksResponseDto,
  TaskListItemDto,
} from '../contract';
import { Task } from 'src/modules/tasks/domain/task.entity';

@Injectable()
export class GetTasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(query: GetTasksQueryDto): Promise<GetTasksResponseDto> {
    const { page = 1, limit = 10, status, priority, search } = query;

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

    qb.orderBy('task.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

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
