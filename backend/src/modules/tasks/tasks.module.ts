import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './domain/task.entity';
import { CreateTaskEndpoint } from './apps/features/v1/createTask/endpoint';
import { CreateTaskService } from './apps/features/v1/createTask/services';
import { GetTaskByIdService } from './apps/features/v1/getTaskById/services';
import { GetTaskByIdEndpoint } from './apps/features/v1/getTaskById/endpoint';
import { UpdateTaskService } from './apps/features/v1/updateTask/services';
import { UpdateTaskEndpoint } from './apps/features/v1/updateTask/endpoint';
import { RemoveTaskEndpoint } from './apps/features/v1/removeTask/endpoint';
import { RemoveTaskService } from './apps/features/v1/removeTask/services';
import { GetTasksEndpoint } from './apps/features/v1/getTasks/endpoint';
import { GetTasksService } from './apps/features/v1/getTasks/services';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [
    CreateTaskEndpoint,
    GetTaskByIdEndpoint,
    UpdateTaskEndpoint,
    RemoveTaskEndpoint,
    GetTasksEndpoint,
  ],
  providers: [
    CreateTaskService,
    GetTaskByIdService,
    UpdateTaskService,
    RemoveTaskService,
    GetTasksService,
  ],
})
export class TasksModule {}
