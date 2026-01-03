import { create } from 'zustand'
import type { Task, PaginatedTasksResponse } from '@/types/task'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  GetTasksParams,
} from '@/api/tasks.api'

interface TasksState {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
  selectedTask: Task | null
  loading: boolean
  error: string | null

  fetchTasks: (params?: GetTasksParams) => Promise<void>
  fetchTaskById: (id: string) => Promise<void>
  createTask: (payload: Partial<Task>) => Promise<void>
  updateTask: (id: string, payload: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  pagination: null,
  selectedTask: null,
  loading: false,
  error: null,

  fetchTasks: async (params?: GetTasksParams) => {
    set({ loading: true, error: null })
    try {
      const res: PaginatedTasksResponse = await getTasks(params)
      const totalPages = Math.ceil(res.meta.total / res.meta.limit)
      set({
        tasks: res.data,
        pagination: {
          ...res.meta,
          totalPages,
        },
        loading: false
      })
    } catch (err) {
      set({
        error: (err as Error).message,
        loading: false,
      })
    }
  },

  fetchTaskById: async (id) => {
    set({ loading: true, error: null })
    try {
      const task = await getTaskById(id)
      set({ selectedTask: task, loading: false })
    } catch (err) {
      set({
        error: (err as Error).message,
        loading: false,
      })
    }
  },

  createTask: async (payload) => {
    set({ loading: true, error: null })
    try {
      await createTask(payload)
      // Refresh current page after creating
      const { fetchTasks } = get()
      await fetchTasks()
    } catch (err) {
      set({
        error: (err as Error).message,
        loading: false,
      })
    }
  },

  updateTask: async (id, payload) => {
    set({ loading: true, error: null })
    try {
      await updateTask(id, payload)
      // Refresh current page after updating
      const { fetchTasks } = get()
      await fetchTasks()
    } catch (err) {
      set({
        error: (err as Error).message,
        loading: false,
      })
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteTask(id)
      // Refresh current page after deleting
      const { fetchTasks } = get()
      await fetchTasks()
    } catch (err) {
      set({
        error: (err as Error).message,
        loading: false,
      })
    }
  },
}))
