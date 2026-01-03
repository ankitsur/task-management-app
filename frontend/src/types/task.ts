export type TaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type TaskPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority?: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedTasksResponse {
  data: Task[]
  meta: {
    page: number
    limit: number
    total: number
  }
}
