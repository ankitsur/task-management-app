import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { RemoveTaskService } from '../../../src/modules/tasks/apps/features/v1/removeTask/services';
import { TaskStatus } from '../../../src/modules/tasks/apps/features/v1/createTask/contract';
import { NotFoundException } from '@nestjs/common';

describe('RemoveTaskService', () => {
  let service: RemoveTaskService;
  let mockRepository: {
    findOneBy: ReturnType<typeof mock.fn>;
    remove: ReturnType<typeof mock.fn>;
  };

  const existingTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Task to Delete',
    description: 'Description',
    status: TaskStatus.PENDING,
    priority: null,
    dueDate: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockRepository = {
      findOneBy: mock.fn(() => Promise.resolve({ ...existingTask })),
      remove: mock.fn(() => Promise.resolve()),
    };

    service = new RemoveTaskService(mockRepository as any);
  });

  describe('execute', () => {
    it('should delete a task successfully', async () => {
      const result = await service.execute(existingTask.id);

      assert.strictEqual(result.success, true);
      assert.ok(result.message.includes(existingTask.id));
      assert.ok(result.message.includes('deleted successfully'));
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(null));

      await assert.rejects(
        () => service.execute('non-existent-id'),
        NotFoundException
      );
    });

    it('should call repository.findOneBy with correct id', async () => {
      await service.execute(existingTask.id);

      assert.strictEqual(mockRepository.findOneBy.mock.callCount(), 1);
      const findCall = mockRepository.findOneBy.mock.calls[0];
      assert.deepStrictEqual(findCall.arguments[0], { id: existingTask.id });
    });

    it('should call repository.remove with found task', async () => {
      await service.execute(existingTask.id);

      assert.strictEqual(mockRepository.remove.mock.callCount(), 1);
      const removeCall = mockRepository.remove.mock.calls[0];
      const removeArg = removeCall.arguments[0] as { id: string };
      assert.strictEqual(removeArg.id, existingTask.id);
    });

    it('should not call remove if task not found', async () => {
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(null));

      try {
        await service.execute('non-existent-id');
      } catch {
        // Expected to throw
      }

      assert.strictEqual(mockRepository.remove.mock.callCount(), 0);
    });

    it('should return success true on successful deletion', async () => {
      const result = await service.execute(existingTask.id);

      assert.strictEqual(result.success, true);
    });

    it('should include task id in success message', async () => {
      const result = await service.execute(existingTask.id);

      assert.ok(result.message.includes(existingTask.id));
    });

    it('should handle different task IDs correctly', async () => {
      const differentId = '987fcdeb-51a2-3c4d-b567-890123456789';
      mockRepository.findOneBy = mock.fn(() => 
        Promise.resolve({ ...existingTask, id: differentId })
      );

      const result = await service.execute(differentId);

      assert.ok(result.message.includes(differentId));
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database connection failed');
      mockRepository.findOneBy = mock.fn(() => Promise.reject(error));

      await assert.rejects(
        () => service.execute(existingTask.id),
        error
      );
    });
  });
});

