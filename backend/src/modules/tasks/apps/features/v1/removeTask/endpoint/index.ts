import { Controller, Delete, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RemoveTaskService } from '../services';
import { RemoveTaskResponseDto } from '../contract';

@ApiTags('tasks')
@Controller('/api/v1/tasks')
export class RemoveTaskEndpoint {
  constructor(private readonly removeTaskService: RemoveTaskService) {}

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 404 })
  async removeTask(@Param('id') id: string): Promise<RemoveTaskResponseDto> {
    return this.removeTaskService.execute(id);
  }
}
