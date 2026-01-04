import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { CreateTaskService } from '../../../src/modules/tasks/apps/features/v1/createTask/services';
import { TaskStatus, TaskPriority } from '../../../src/modules/tasks/apps/features/v1/createTask/contract';

describe('CreateTaskService', () => {
  let service: CreateTaskService;
  let mockRepository: {
    create: ReturnType<typeof mock.fn>;
    save: ReturnType<typeof mock.fn>;
  };

  const mockTask = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2024-12-31'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    mockRepository = {
      create: mock.fn(() => mockTask),
      save: mock.fn(() => Promise.resolve(mockTask)),
    };

    service = new CreateTaskService(mockRepository as any);
  });

  describe('execute', () => {
    it('should create a task with all fields', async () => {
      const request = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: '2024-12-31T00:00:00.000Z',
      };

      const result = await service.execute(request);

      assert.strictEqual(result.id, mockTask.id);
      assert.strictEqual(result.title, mockTask.title);
      assert.strictEqual(result.description, mockTask.description);
      assert.strictEqual(result.status, mockTask.status);
      assert.strictEqual(result.priority, mockTask.priority);
      assert.ok(result.createdAt);
      assert.ok(result.updatedAt);
    });

    it('should create a task with only required fields', async () => {
      const minimalTask = {
        ...mockTask,
        description: undefined,
        priority: undefined,
        dueDate: undefined,
      };

      mockRepository.create = mock.fn(() => minimalTask);
      mockRepository.save = mock.fn(() => Promise.resolve(minimalTask));

      const request = {
        title: 'Minimal Task',
      };

      const result = await service.execute(request);

      assert.strictEqual(result.title, minimalTask.title);
      assert.strictEqual(result.status, TaskStatus.PENDING);
    });

    it('should default status to PENDING when not provided', async () => {
      const request = {
        title: 'Test Task',
      };

      await service.execute(request);

      const createCall = mockRepository.create.mock.calls[0];
      assert.strictEqual(createCall.arguments[0].status, TaskStatus.PENDING);
    });

    it('should convert dueDate string to Date object', async () => {
      const request = {
        title: 'Test Task',
        dueDate: '2024-12-31T00:00:00.000Z',
      };

      await service.execute(request);

      const createCall = mockRepository.create.mock.calls[0];
      assert.ok(createCall.arguments[0].dueDate instanceof Date);
    });

    it('should handle task without dueDate', async () => {
      const taskWithoutDueDate = {
        ...mockTask,
        dueDate: undefined,
      };

      mockRepository.create = mock.fn(() => taskWithoutDueDate);
      mockRepository.save = mock.fn(() => Promise.resolve(taskWithoutDueDate));

      const request = {
        title: 'Test Task',
      };

      const result = await service.execute(request);

      assert.strictEqual(result.dueDate, undefined);
    });

    it('should call repository.create with correct parameters', async () => {
      const request = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      };

      await service.execute(request);

      assert.strictEqual(mockRepository.create.mock.callCount(), 1);
      const createCall = mockRepository.create.mock.calls[0];
      assert.strictEqual(createCall.arguments[0].title, request.title);
      assert.strictEqual(createCall.arguments[0].description, request.description);
      assert.strictEqual(createCall.arguments[0].status, request.status);
      assert.strictEqual(createCall.arguments[0].priority, request.priority);
    });

    it('should call repository.save with created task', async () => {
      const request = {
        title: 'Test Task',
      };

      await service.execute(request);

      assert.strictEqual(mockRepository.save.mock.callCount(), 1);
    });

    it('should return formatted response with ISO date strings', async () => {
      const request = {
        title: 'Test Task',
      };

      const result = await service.execute(request);

      assert.strictEqual(typeof result.createdAt, 'string');
      assert.strictEqual(typeof result.updatedAt, 'string');
      assert.ok(result.createdAt.includes('T')); // ISO format check
    });
  });
});

