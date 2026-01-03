import { http } from '@/lib/http'
import type { Task, PaginatedTasksResponse } from '@/types/task'

export interface GetTasksParams {
  page?: number
  limit?: number
  status?: string
  priority?: string
  search?: string
}

export function getTasks(params?: GetTasksParams) {
  const query = new URLSearchParams(
    params as Record<string, string>
  ).toString()

  return http<PaginatedTasksResponse>(
    `/tasks${query ? `?${query}` : ''}`
  )
}

export function getTaskById(id: string) {
  return http<Task>(`/tasks/${id}`)
}

export function createTask(payload: Partial<Task>) {
  return http<Task>(`/tasks`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTask(
  id: string,
  payload: Partial<Task>
) {
  return http<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteTask(id: string) {
  return http<{ success: true }>(`/tasks/${id}`, {
    method: 'DELETE',
  })
}
