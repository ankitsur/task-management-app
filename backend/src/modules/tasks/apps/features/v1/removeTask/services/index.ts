import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RemoveTaskResponseDto } from '../contract';
import { Task } from 'src/modules/tasks/domain/task.entity';

@Injectable()
export class RemoveTaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(id: string): Promise<RemoveTaskResponseDto> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    await this.taskRepository.remove(task);

    return {
      success: true,
      message: `Task with id ${id} deleted successfully`,
    };
  }
}
