import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UpdateTaskRequestDto, UpdateTaskResponseDto } from '../contract';
import { UpdateTaskService } from '../services';

@ApiTags('tasks')
@Controller('/api/v1/tasks')
export class UpdateTaskEndpoint {
  constructor(private readonly updateTaskService: UpdateTaskService) {}

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateTaskRequestDto })
  @ApiResponse({ status: 200, type: UpdateTaskResponseDto })
  async updateTask(
    @Param('id') id: string,
    @Body() request: UpdateTaskRequestDto,
  ): Promise<UpdateTaskResponseDto> {
    return this.updateTaskService.execute(id, request);
  }
}
