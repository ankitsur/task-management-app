import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetTaskByIdService } from '../services';
import { GetTaskByIdResponseDto } from '../contract';

@ApiTags('tasks')
@Controller('/api/v1/tasks')
export class GetTaskByIdEndpoint {
  constructor(private readonly getTaskByIdService: GetTaskByIdService) {}

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: GetTaskByIdResponseDto })
  @ApiResponse({ status: 404 })
  async getTaskById(@Param('id') id: string): Promise<GetTaskByIdResponseDto> {
    return this.getTaskByIdService.execute(id);
  }
}
