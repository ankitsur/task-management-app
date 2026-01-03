import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateTaskRequestDto, CreateTaskResponseDto } from '../contract';
import { CreateTaskService } from '../services';

@ApiTags('tasks')
@Controller('/api/v1/tasks')
export class CreateTaskEndpoint {
  constructor(private readonly createTaskService: CreateTaskService) {}

  @Post()
  @ApiBody({ type: CreateTaskRequestDto })
  @ApiResponse({ status: 201, type: CreateTaskResponseDto })
  async createTask(
    @Body() request: CreateTaskRequestDto,
  ): Promise<CreateTaskResponseDto> {
    return this.createTaskService.execute(request);
  }
}
