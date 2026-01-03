import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateTaskRequestDto, UpdateTaskResponseDto } from '../contract';
import { Task } from 'src/modules/tasks/domain/task.entity';

@Injectable()
export class UpdateTaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(
    id: string,
    request: UpdateTaskRequestDto,
  ): Promise<UpdateTaskResponseDto> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    task.title = request.title;
    task.description = request.description;
    task.status = request.status ?? task.status;
    task.priority = request.priority;
    task.dueDate = request.dueDate ? new Date(request.dueDate) : undefined;

    const updatedTask = await this.taskRepository.save(task);

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate
        ? updatedTask.dueDate.toISOString()
        : undefined,
      createdAt: updatedTask.createdAt.toISOString(),
      updatedAt: updatedTask.updatedAt.toISOString(),
    };
  }
}
