import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateTaskRequestDto,
  CreateTaskResponseDto,
  TaskStatus,
} from '../contract';
import { Task } from 'src/modules/tasks/domain/task.entity';

@Injectable()
export class CreateTaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(request: CreateTaskRequestDto): Promise<CreateTaskResponseDto> {
    const task = this.taskRepository.create({
      title: request.title,
      description: request.description,
      status: request.status ?? TaskStatus.PENDING,
      priority: request.priority,
      dueDate: request.dueDate ? new Date(request.dueDate) : undefined,
    });

    const savedTask = await this.taskRepository.save(task);

    return {
      id: savedTask.id,
      title: savedTask.title,
      description: savedTask.description,
      status: savedTask.status,
      priority: savedTask.priority,
      dueDate: savedTask.dueDate ? savedTask.dueDate.toISOString() : undefined,
      createdAt: savedTask.createdAt.toISOString(),
      updatedAt: savedTask.updatedAt.toISOString(),
    };
  }
}
