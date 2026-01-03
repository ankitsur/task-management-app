import { create } from 'zustand'
import type { Task } from '@/types/task'
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '@/api/tasks.api'

interface TasksState {
  tasks: Task[]
  selectedTask: Task | null
  loading: boolean
  error: string | null

  fetchTasks: () => Promise<void>
  fetchTaskById: (id: string) => Promise<void>
  createTask: (payload: Partial<Task>) => Promise<void>
  updateTask: (id: string, payload: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const res = await getTasks()
      set({ tasks: res.data, loading: false })
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
      const res = await getTasks()
      set({ tasks: res.data, loading: false })
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
      const res = await getTasks()
      set({ tasks: res.data, loading: false })
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
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({
        error: (err as Error).message,
        loading: false,
      })
    }
  },
}))
