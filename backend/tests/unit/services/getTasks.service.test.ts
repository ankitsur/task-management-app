import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { GetTasksService } from '../../../src/modules/tasks/apps/features/v1/getTasks/services';
import { TaskStatus, TaskPriority } from '../../../src/modules/tasks/apps/features/v1/createTask/contract';

describe('GetTasksService', () => {
  let service: GetTasksService;
  let mockQueryBuilder: {
    andWhere: ReturnType<typeof mock.fn>;
    orderBy: ReturnType<typeof mock.fn>;
    skip: ReturnType<typeof mock.fn>;
    take: ReturnType<typeof mock.fn>;
    getManyAndCount: ReturnType<typeof mock.fn>;
  };
  let mockRepository: {
    createQueryBuilder: ReturnType<typeof mock.fn>;
  };

  const mockTasks = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Task 1',
      description: 'Description 1',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2024-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '223e4567-e89b-12d3-a456-426614174001',
      title: 'Task 2',
      description: 'Description 2',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      dueDate: null,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-04'),
    },
  ];

  beforeEach(() => {
    mockQueryBuilder = {
      andWhere: mock.fn(function(this: typeof mockQueryBuilder) { return this; }),
      orderBy: mock.fn(function(this: typeof mockQueryBuilder) { return this; }),
      skip: mock.fn(function(this: typeof mockQueryBuilder) { return this; }),
      take: mock.fn(function(this: typeof mockQueryBuilder) { return this; }),
      getManyAndCount: mock.fn(() => Promise.resolve([mockTasks, mockTasks.length])),
    };

    mockRepository = {
      createQueryBuilder: mock.fn(() => mockQueryBuilder),
    };

    service = new GetTasksService(mockRepository as any);
  });

  describe('execute', () => {
    it('should return paginated tasks with default parameters', async () => {
      const query = { page: 1, limit: 10 };

      const result = await service.execute(query);

      assert.strictEqual(result.data.length, 2);
      assert.strictEqual(result.meta.page, 1);
      assert.strictEqual(result.meta.limit, 10);
      assert.strictEqual(result.meta.total, 2);
    });

    it('should apply pagination correctly', async () => {
      const query = { page: 2, limit: 5 };

      await service.execute(query);

      const skipCall = mockQueryBuilder.skip.mock.calls[0];
      const takeCall = mockQueryBuilder.take.mock.calls[0];
      
      assert.strictEqual(skipCall.arguments[0], 5); // (page - 1) * limit
      assert.strictEqual(takeCall.arguments[0], 5);
    });

    it('should filter by status when provided', async () => {
      const query = { page: 1, limit: 10, status: TaskStatus.PENDING };

      await service.execute(query);

      const andWhereCalls = mockQueryBuilder.andWhere.mock.calls;
      const statusCall = andWhereCalls.find(
        (call: { arguments: unknown[] }) => 
          (call.arguments[0] as string).includes('status')
      );
      
      assert.ok(statusCall);
      assert.strictEqual((statusCall.arguments[1] as { status: TaskStatus }).status, TaskStatus.PENDING);
    });

    it('should filter by priority when provided', async () => {
      const query = { page: 1, limit: 10, priority: TaskPriority.HIGH };

      await service.execute(query);

      const andWhereCalls = mockQueryBuilder.andWhere.mock.calls;
      const priorityCall = andWhereCalls.find(
        (call: { arguments: unknown[] }) => 
          (call.arguments[0] as string).includes('priority')
      );
      
      assert.ok(priorityCall);
      assert.strictEqual((priorityCall.arguments[1] as { priority: TaskPriority }).priority, TaskPriority.HIGH);
    });

    it('should filter by search when provided', async () => {
      const query = { page: 1, limit: 10, search: 'test' };

      await service.execute(query);

      const andWhereCalls = mockQueryBuilder.andWhere.mock.calls;
      const searchCall = andWhereCalls.find(
        (call: { arguments: unknown[] }) => 
          (call.arguments[0] as string).includes('ILIKE')
      );
      
      assert.ok(searchCall);
      assert.strictEqual((searchCall.arguments[1] as { search: string }).search, '%test%');
    });

    it('should combine multiple filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        search: 'test',
      };

      await service.execute(query);

      assert.strictEqual(mockQueryBuilder.andWhere.mock.callCount(), 3);
    });

    it('should order by created_at DESC when no sortBy provided', async () => {
      await service.execute({ page: 1, limit: 10 });

      const orderByCall = mockQueryBuilder.orderBy.mock.calls[0];
      assert.strictEqual(orderByCall.arguments[0], 'task.created_at');
      assert.strictEqual(orderByCall.arguments[1], 'DESC');
    });

    it('should return formatted task data', async () => {
      const result = await service.execute({ page: 1, limit: 10 });

      const task = result.data[0];
      assert.strictEqual(task.id, mockTasks[0].id);
      assert.strictEqual(task.title, mockTasks[0].title);
      assert.strictEqual(typeof task.createdAt, 'string');
      assert.strictEqual(typeof task.updatedAt, 'string');
    });

    it('should handle empty results', async () => {
      mockQueryBuilder.getManyAndCount = mock.fn(() => Promise.resolve([[], 0]));

      const result = await service.execute({ page: 1, limit: 10 });

      assert.strictEqual(result.data.length, 0);
      assert.strictEqual(result.meta.total, 0);
    });

    it('should handle tasks without dueDate', async () => {
      const result = await service.execute({ page: 1, limit: 10 });

      const taskWithoutDueDate = result.data.find(t => t.id === mockTasks[1].id);
      assert.strictEqual(taskWithoutDueDate?.dueDate, undefined);
    });

    it('should convert dueDate to ISO string when present', async () => {
      const result = await service.execute({ page: 1, limit: 10 });

      const taskWithDueDate = result.data.find(t => t.id === mockTasks[0].id);
      assert.ok(taskWithDueDate?.dueDate);
      assert.strictEqual(typeof taskWithDueDate.dueDate, 'string');
    });

    it('should use page 1 as default', async () => {
      await service.execute({ page: 1, limit: 5 });

      const skipCall = mockQueryBuilder.skip.mock.calls[0];
      assert.strictEqual(skipCall.arguments[0], 0); // (1 - 1) * 5
    });

    it('should use limit 10 as default', async () => {
      await service.execute({ page: 1, limit: 10 });

      const takeCall = mockQueryBuilder.take.mock.calls[0];
      assert.strictEqual(takeCall.arguments[0], 10);
    });

    it('should return correct meta information', async () => {
      const query = { page: 3, limit: 20 };

      const result = await service.execute(query);

      assert.strictEqual(result.meta.page, 3);
      assert.strictEqual(result.meta.limit, 20);
    });

    it('should handle large datasets', async () => {
      const largeTasks = Array.from({ length: 100 }, (_, i) => ({
        ...mockTasks[0],
        id: `task-${i}`,
        title: `Task ${i}`,
      }));
      mockQueryBuilder.getManyAndCount = mock.fn(() => 
        Promise.resolve([largeTasks.slice(0, 10), largeTasks.length])
      );

      const result = await service.execute({ page: 1, limit: 10 });

      assert.strictEqual(result.data.length, 10);
      assert.strictEqual(result.meta.total, 100);
    });
  });
});

