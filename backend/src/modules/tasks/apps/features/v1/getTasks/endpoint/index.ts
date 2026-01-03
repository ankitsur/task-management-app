import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetTasksService } from '../services';
import { GetTasksQueryDto, GetTasksResponseDto } from '../contract';

@ApiTags('tasks')
@Controller('/api/v1/tasks')
export class GetTasksEndpoint {
  constructor(private readonly getTasksService: GetTasksService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, type: GetTasksResponseDto })
  async getTasks(
    @Query() query: GetTasksQueryDto,
  ): Promise<GetTasksResponseDto> {
    return this.getTasksService.execute(query);
  }
}
