import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { GetTaskByIdService } from '../../../src/modules/tasks/apps/features/v1/getTaskById/services';
import { TaskStatus, TaskPriority } from '../../../src/modules/tasks/apps/features/v1/createTask/contract';
import { NotFoundException } from '@nestjs/common';

describe('GetTaskByIdService', () => {
  let service: GetTaskByIdService;
  let mockRepository: {
    findOneBy: ReturnType<typeof mock.fn>;
  };

  const existingTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  beforeEach(() => {
    mockRepository = {
      findOneBy: mock.fn(() => Promise.resolve({ ...existingTask })),
    };

    service = new GetTaskByIdService(mockRepository as any);
  });

  describe('execute', () => {
    it('should return a task by id', async () => {
      const result = await service.execute(existingTask.id);

      assert.strictEqual(result.id, existingTask.id);
      assert.strictEqual(result.title, existingTask.title);
      assert.strictEqual(result.description, existingTask.description);
      assert.strictEqual(result.status, existingTask.status);
      assert.strictEqual(result.priority, existingTask.priority);
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

    it('should return dueDate as ISO string', async () => {
      const result = await service.execute(existingTask.id);

      assert.ok(result.dueDate);
      assert.strictEqual(typeof result.dueDate, 'string');
      assert.ok(result.dueDate.includes('2024-12-31'));
    });

    it('should return undefined dueDate when task has no due date', async () => {
      const taskWithoutDueDate = {
        ...existingTask,
        dueDate: null,
      };
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(taskWithoutDueDate));

      const result = await service.execute(existingTask.id);

      assert.strictEqual(result.dueDate, undefined);
    });

    it('should return createdAt as ISO string', async () => {
      const result = await service.execute(existingTask.id);

      assert.strictEqual(typeof result.createdAt, 'string');
      assert.ok(result.createdAt.includes('T')); // ISO format
    });

    it('should return updatedAt as ISO string', async () => {
      const result = await service.execute(existingTask.id);

      assert.strictEqual(typeof result.updatedAt, 'string');
      assert.ok(result.updatedAt.includes('T')); // ISO format
    });

    it('should handle task without description', async () => {
      const taskWithoutDescription = {
        ...existingTask,
        description: undefined,
      };
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(taskWithoutDescription));

      const result = await service.execute(existingTask.id);

      assert.strictEqual(result.description, undefined);
    });

    it('should handle task without priority', async () => {
      const taskWithoutPriority = {
        ...existingTask,
        priority: undefined,
      };
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(taskWithoutPriority));

      const result = await service.execute(existingTask.id);

      assert.strictEqual(result.priority, undefined);
    });

    it('should include error message with task id when not found', async () => {
      mockRepository.findOneBy = mock.fn(() => Promise.resolve(null));
      const testId = 'test-uuid-12345';

      try {
        await service.execute(testId);
        assert.fail('Should have thrown NotFoundException');
      } catch (error) {
        assert.ok(error instanceof NotFoundException);
        assert.ok((error as NotFoundException).message.includes(testId));
      }
    });

    it('should handle all status values correctly', async () => {
      for (const status of Object.values(TaskStatus)) {
        const taskWithStatus = { ...existingTask, status };
        mockRepository.findOneBy = mock.fn(() => Promise.resolve(taskWithStatus));

        const result = await service.execute(existingTask.id);
        assert.strictEqual(result.status, status);
      }
    });
  });
});

