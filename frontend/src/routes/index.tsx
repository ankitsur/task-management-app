import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { useTasksStore } from '@/store/tasks.store'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  ListTodo,
  Inbox,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import type { TaskStatus, TaskPriority, Task } from '@/types/task'

export const Route = createFileRoute('/')({
  component: TaskListPage,
})

/* =============================================================================
   STATUS & PRIORITY CONFIGURATION
============================================================================= */

const STATUS_CONFIG: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'outline' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  HIGH: { label: 'High', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
}

/* =============================================================================
   HELPER FUNCTIONS
============================================================================= */

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function isOverdue(dateString: string, status: TaskStatus): boolean {
  if (status === 'COMPLETED' || status === 'CANCELLED') return false
  return new Date(dateString) < new Date()
}

/* =============================================================================
   TASK CARD COMPONENT
============================================================================= */

interface TaskCardProps {
  task: Task
}

function TaskCard({ task }: TaskCardProps) {
  const statusConfig = STATUS_CONFIG[task.status]
  const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null
  const taskIsOverdue = task.dueDate ? isOverdue(task.dueDate, task.status) : false

  return (
    <Link to={`/tasks/${task.id}`} className="block group">
      <Card className="border border-border bg-card card-hover">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              {/* Title */}
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors duration-150 line-clamp-1">
                {task.title}
              </h3>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Metadata row */}
              <div className="flex items-center flex-wrap gap-2 pt-1">
                {/* Priority badge */}
                {priorityConfig && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityConfig.className}`}>
                    {priorityConfig.label}
                  </span>
                )}

                {/* Due date */}
                {task.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      taskIsOverdue
                        ? 'text-destructive font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Status badge */}
            <Badge variant={statusConfig.variant} className="shrink-0">
              {statusConfig.label}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

/* =============================================================================
   EMPTY STATE COMPONENT
============================================================================= */

interface EmptyStateProps {
  hasFilters: boolean
}

function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-border">
      <CardContent className="py-16 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          {hasFilters ? 'No matching tasks' : 'No tasks yet'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          {hasFilters
            ? 'Try adjusting your filters to find what you\'re looking for.'
            : 'Get started by creating your first task to track your work.'}
        </p>
        {!hasFilters && (
          <Link to="/tasks/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

/* =============================================================================
   LOADING SKELETON
============================================================================= */

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border border-border">
          <CardContent className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded w-20" />
              </div>
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="flex gap-2">
                <div className="h-4 bg-muted rounded w-16" />
                <div className="h-4 bg-muted rounded w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

/* =============================================================================
   PAGINATION COMPONENT
============================================================================= */

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages: number[] = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1 px-2">
        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8 p-0 text-sm"
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

/* =============================================================================
   MAIN PAGE COMPONENT
============================================================================= */

function TaskListPage() {
  const { tasks, pagination, loading, fetchTasks } = useTasksStore()

  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset page when filters change
  const handleFilterChange = useCallback(
    (type: 'status' | 'priority' | 'pageSize', value: string | number) => {
      if (type === 'status') setStatusFilter(value as TaskStatus | 'ALL')
      else if (type === 'priority') setPriorityFilter(value as TaskPriority | 'ALL')
      else if (type === 'pageSize') setPageSize(value as number)
      setCurrentPage(1)
    },
    []
  )

  // Fetch tasks with current filters
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(statusFilter !== 'ALL' && { status: statusFilter }),
      ...(priorityFilter !== 'ALL' && { priority: priorityFilter }),
    }
    fetchTasks(params)
  }, [fetchTasks, currentPage, pageSize, debouncedSearch, statusFilter, priorityFilter])

  // Computed values with defensive checks
  const hasActiveFilters = Boolean(debouncedSearch || statusFilter !== 'ALL' || priorityFilter !== 'ALL')
  const totalTasks = pagination?.total ?? 0
  
  // Fix: Clamp totalPages to ensure it's at least 1 when there are tasks
  const totalPages = useMemo(() => {
    if (!pagination || totalTasks === 0) return 1
    return Math.max(1, Math.ceil(totalTasks / pageSize))
  }, [pagination, totalTasks, pageSize])

  // Fix: Auto-correct current page if it exceeds total pages (pagination bug fix)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Determine if we should show pagination controls
  const showPagination = !loading && totalTasks > 0 && totalPages > 1
  const showPageSizeSelector = !loading && totalTasks > 5

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                Tasks
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage and track your work in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/tasks/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </Link>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority filter */}
          <Select
            value={priorityFilter}
            onValueChange={(value) => handleFilterChange('priority', value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {loading ? 'Loading...' : `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`}
          </span>

          {showPageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">Per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handleFilterChange('pageSize', Number(value))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Task list */}
        {loading ? (
          <LoadingSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && (
          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
