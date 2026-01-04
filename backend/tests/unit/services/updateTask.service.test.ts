import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { UpdateTaskService } from '../../../src/modules/tasks/apps/features/v1/updateTask/services';
import { TaskStatus, TaskPriority } from '../../../src/modules/tasks/apps/features/v1/createTask/contract';
import { NotFoundException } from '@nestjs/common';

describe('UpdateTaskService', () => {
  let service: UpdateTaskService;
  let mockRepository: {
    findOneBy: ReturnType<typeof mock.fn>;
    save: ReturnType<typeof mock.fn>;
  };

  const existingTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Original Title',
    description: 'Original Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.LOW,
    dueDate: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockRepository = {
      findOneBy: mock.fn(() => Promise.resolve({ ...existingTask })),
      save: mock.fn((task) => Promise.resolve({ ...task, updatedAt: new Date() })),
    };

    service = new UpdateTaskService(mockRepository as any);
  });

  describe('execute', () => {
    it('should update a task successfully', async () => {
      const request = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      };

      const result = await service.execute(existingTask.id, request);

      assert.strictEqual(result.id, existingTask.id);
      assert.strictEqual(result.title, request.title);
      assert.strictEqual(result.description, request.description);
      assert.strictEqual(result.status, request.status);
      assert.strictEqual(result.priority, request.priority);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(null));

      const request = {
        title: 'Updated Title',
      };

      await assert.rejects(
        () => service.execute('non-existent-id', request),
        NotFoundException
      );
    });

    it('should preserve existing status when not provided in request', async () => {
      const request = {
        title: 'Updated Title',
      };

      const result = await service.execute(existingTask.id, request);

      assert.strictEqual(result.status, existingTask.status);
    });

    it('should update dueDate correctly', async () => {
      const request = {
        title: 'Updated Title',
        dueDate: '2025-06-15T00:00:00.000Z',
      };

      const result = await service.execute(existingTask.id, request);

      assert.ok(result.dueDate);
      assert.ok(result.dueDate.includes('2025-06-15'));
    });

    it('should clear dueDate when not provided', async () => {
      const request = {
        title: 'Updated Title',
      };

      const result = await service.execute(existingTask.id, request);

      assert.strictEqual(result.dueDate, undefined);
    });

    it('should call repository.findOneBy with correct id', async () => {
      const request = {
        title: 'Updated Title',
      };

      await service.execute(existingTask.id, request);

      assert.strictEqual(mockRepository.findOneBy.mock.callCount(), 1);
      const findCall = mockRepository.findOneBy.mock.calls[0];
      assert.deepStrictEqual(findCall.arguments[0], { id: existingTask.id });
    });

    it('should call repository.save with updated task', async () => {
      const request = {
        title: 'Updated Title',
        status: TaskStatus.COMPLETED,
      };

      await service.execute(existingTask.id, request);

      assert.strictEqual(mockRepository.save.mock.callCount(), 1);
      const saveCall = mockRepository.save.mock.calls[0];
      const saveArg = saveCall.arguments[0] as { title: string; status: TaskStatus };
      assert.strictEqual(saveArg.title, request.title);
      assert.strictEqual(saveArg.status, request.status);
    });

    it('should update priority to undefined when not provided', async () => {
      const request = {
        title: 'Updated Title',
      };

      const result = await service.execute(existingTask.id, request);

      assert.strictEqual(result.priority, undefined);
    });

    it('should return formatted response with ISO date strings', async () => {
      const request = {
        title: 'Updated Title',
      };

      const result = await service.execute(existingTask.id, request);

      assert.strictEqual(typeof result.createdAt, 'string');
      assert.strictEqual(typeof result.updatedAt, 'string');
    });

    it('should handle all status values correctly', async () => {
      for (const status of Object.values(TaskStatus)) {
        mockRepository.findOneBy = mock.fn(() => Promise.resolve({ ...existingTask }));
        
        const request = {
          title: 'Updated Title',
          status,
        };

        const result = await service.execute(existingTask.id, request);
        assert.strictEqual(result.status, status);
      }
    });

    it('should handle all priority values correctly', async () => {
      for (const priority of Object.values(TaskPriority)) {
        mockRepository.findOneBy = mock.fn(() => Promise.resolve({ ...existingTask }));
        
        const request = {
          title: 'Updated Title',
          priority,
        };

        const result = await service.execute(existingTask.id, request);
        assert.strictEqual(result.priority, priority);
      }
    });
  });
});

