import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTasksStore } from './tasks.store'

// Mock the API module
vi.mock('@/api/tasks.api', () => ({
  getTasks: vi.fn(),
  getTaskById: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

// Import mocked functions
import * as api from '@/api/tasks.api'

describe('useTasksStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTasksStore.setState({
      tasks: [],
      selectedTask: null,
      pagination: null,
      loading: false,
      error: null,
    })
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useTasksStore.getState()

      expect(state.tasks).toEqual([])
      expect(state.selectedTask).toBeNull()
      expect(state.pagination).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('fetchTasks', () => {
    it('should set loading to true when fetching', async () => {
      const mockResponse = {
        data: [],
        meta: { page: 1, limit: 10, total: 0 },
      }
      vi.mocked(api.getTasks).mockResolvedValue(mockResponse)

      const fetchPromise = useTasksStore.getState().fetchTasks()
      
      // Check loading was set to true
      expect(useTasksStore.getState().loading).toBe(true)
      
      await fetchPromise
      
      // Check loading is false after completion
      expect(useTasksStore.getState().loading).toBe(false)
    })

    it('should populate tasks on successful fetch', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          status: 'PENDING' as const,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Task 2',
          status: 'COMPLETED' as const,
          createdAt: '2024-01-02',
          updatedAt: '2024-01-02',
        },
      ]

      vi.mocked(api.getTasks).mockResolvedValue({
        data: mockTasks,
        meta: { page: 1, limit: 10, total: 2 },
      })

      await useTasksStore.getState().fetchTasks()

      const state = useTasksStore.getState()
      expect(state.tasks).toEqual(mockTasks)
      expect(state.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      })
    })

    it('should set error on failed fetch', async () => {
      vi.mocked(api.getTasks).mockRejectedValue(new Error('Network error'))

      await useTasksStore.getState().fetchTasks()

      const state = useTasksStore.getState()
      expect(state.error).toBe('Network error')
      expect(state.loading).toBe(false)
    })

    it('should pass params to API call', async () => {
      vi.mocked(api.getTasks).mockResolvedValue({
        data: [],
        meta: { page: 2, limit: 20, total: 0 },
      })

      await useTasksStore.getState().fetchTasks({
        page: 2,
        limit: 20,
        status: 'PENDING',
      })

      expect(api.getTasks).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        status: 'PENDING',
      })
    })
  })

  describe('fetchTaskById', () => {
    it('should fetch and set selected task', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        status: 'PENDING' as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      vi.mocked(api.getTaskById).mockResolvedValue(mockTask)

      await useTasksStore.getState().fetchTaskById('1')

      expect(useTasksStore.getState().selectedTask).toEqual(mockTask)
    })

    it('should set error when task not found', async () => {
      vi.mocked(api.getTaskById).mockRejectedValue(new Error('Task not found'))

      await useTasksStore.getState().fetchTaskById('invalid-id')

      expect(useTasksStore.getState().error).toBe('Task not found')
    })
  })

  describe('createTask', () => {
    it('should create task and refresh list', async () => {
      vi.mocked(api.createTask).mockResolvedValue({
        id: 'new-task',
        title: 'New Task',
        status: 'PENDING' as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      })

      vi.mocked(api.getTasks).mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 10, total: 1 },
      })

      await useTasksStore.getState().createTask({ title: 'New Task' })

      expect(api.createTask).toHaveBeenCalledWith({ title: 'New Task' })
      expect(api.getTasks).toHaveBeenCalled() // Should refresh list
    })

    it('should set error on failed creation', async () => {
      vi.mocked(api.createTask).mockRejectedValue(new Error('Validation failed'))

      await useTasksStore.getState().createTask({ title: '' })

      expect(useTasksStore.getState().error).toBe('Validation failed')
    })
  })

  describe('updateTask', () => {
    it('should update task and refresh list', async () => {
      vi.mocked(api.updateTask).mockResolvedValue({
        id: '1',
        title: 'Updated Task',
        status: 'COMPLETED' as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      })

      vi.mocked(api.getTasks).mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 10, total: 1 },
      })

      await useTasksStore.getState().updateTask('1', { status: 'COMPLETED' })

      expect(api.updateTask).toHaveBeenCalledWith('1', { status: 'COMPLETED' })
      expect(api.getTasks).toHaveBeenCalled() // Should refresh list
    })
  })

  describe('deleteTask', () => {
    it('should delete task and refresh list', async () => {
      vi.mocked(api.deleteTask).mockResolvedValue({ success: true })

      vi.mocked(api.getTasks).mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 10, total: 0 },
      })

      await useTasksStore.getState().deleteTask('1')

      expect(api.deleteTask).toHaveBeenCalledWith('1')
      expect(api.getTasks).toHaveBeenCalled() // Should refresh list
    })

    it('should set error on failed deletion', async () => {
      vi.mocked(api.deleteTask).mockRejectedValue(new Error('Delete failed'))

      await useTasksStore.getState().deleteTask('1')

      expect(useTasksStore.getState().error).toBe('Delete failed')
    })
  })
})
