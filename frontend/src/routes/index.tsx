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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListTodo,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import type { TaskStatus, TaskPriority, Task } from '@/types/task'

export const Route = createFileRoute('/')({
  component: TaskListPage,
})

/* =============================================================================
   TYPES
============================================================================= */

type SortField = 'title' | 'status' | 'priority' | 'dueDate'
type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField | null
  direction: SortDirection
}

/* =============================================================================
   STATUS & PRIORITY CONFIGURATION
============================================================================= */

const STATUS_CONFIG: Record<TaskStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; order: number }> = {
  PENDING: { label: 'Pending', variant: 'secondary', order: 1 },
  IN_PROGRESS: { label: 'In Progress', variant: 'default', order: 2 },
  COMPLETED: { label: 'Completed', variant: 'outline', order: 3 },
  CANCELLED: { label: 'Cancelled', variant: 'destructive', order: 4 },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string; order: number }> = {
  LOW: { label: 'Low', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', order: 1 },
  MEDIUM: { label: 'Medium', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', order: 2 },
  HIGH: { label: 'High', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', order: 3 },
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
   SORTABLE TABLE HEADER COMPONENT
============================================================================= */

interface SortableHeaderProps {
  label: string
  field: SortField
  sortConfig: SortConfig
  onSort: (field: SortField) => void
}

function SortableHeader({ label, field, sortConfig, onSort }: SortableHeaderProps) {
  const isActive = sortConfig.field === field
  
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer group"
    >
      <span>{label}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        {isActive ? (
          sortConfig.direction === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5" />
        )}
      </span>
      {isActive && (
        <span className="opacity-100">
          {sortConfig.direction === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )}
        </span>
      )}
    </button>
  )
}

/* =============================================================================
   TRUNCATED DESCRIPTION WITH TOOLTIP COMPONENT
============================================================================= */

interface TruncatedDescriptionProps {
  description: string | undefined
  maxLength?: number
}

function TruncatedDescription({ description, maxLength = 50 }: TruncatedDescriptionProps) {
  if (!description) {
    return <span className="text-muted-foreground italic">—</span>
  }

  const isTruncated = description.length > maxLength
  const displayText = isTruncated ? `${description.slice(0, maxLength)}...` : description

  if (!isTruncated) {
    return <span className="text-muted-foreground">{displayText}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="text-muted-foreground cursor-help border-b border-dashed border-muted-foreground/50">
          {displayText}
        </span>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="max-w-sm bg-popover text-popover-foreground border border-border shadow-lg p-3"
      >
        <p className="text-sm whitespace-pre-wrap">{description}</p>
      </TooltipContent>
    </Tooltip>
  )
}

/* =============================================================================
   TASK TABLE ROW COMPONENT
============================================================================= */

interface TaskTableRowProps {
  task: Task
}

function TaskTableRow({ task }: TaskTableRowProps) {
  const statusConfig = STATUS_CONFIG[task.status]
  const priorityConfig = task.priority ? PRIORITY_CONFIG[task.priority] : null
  const taskIsOverdue = task.dueDate ? isOverdue(task.dueDate, task.status) : false

  return (
    <TableRow className="cursor-pointer group">
      <TableCell className="font-medium max-w-[200px]">
        <Link 
          to={`/tasks/${task.id}`} 
          className="text-foreground hover:text-primary transition-colors block truncate"
          title={task.title}
        >
          {task.title}
        </Link>
      </TableCell>
      <TableCell className="max-w-[250px]">
        <TruncatedDescription description={task.description} maxLength={60} />
      </TableCell>
      <TableCell>
        <Badge variant={statusConfig.variant} className="whitespace-nowrap">
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        {priorityConfig ? (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${priorityConfig.className}`}>
            {priorityConfig.label}
          </span>
        ) : (
          <span className="text-muted-foreground italic">—</span>
        )}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {task.dueDate ? (
          <span
            className={`text-sm ${
              taskIsOverdue
                ? 'text-destructive font-medium'
                : 'text-muted-foreground'
            }`}
          >
            {formatDate(task.dueDate)}
          </span>
        ) : (
          <span className="text-muted-foreground italic">—</span>
        )}
      </TableCell>
    </TableRow>
  )
}

/* =============================================================================
   TASK TABLE COMPONENT
============================================================================= */

interface TaskTableProps {
  tasks: Task[]
  sortConfig: SortConfig
  onSort: (field: SortField) => void
}

function TaskTable({ tasks, sortConfig, onSort }: TaskTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[200px]">
              <SortableHeader 
                label="Title" 
                field="title" 
                sortConfig={sortConfig} 
                onSort={onSort} 
              />
            </TableHead>
            <TableHead className="w-[250px]">
              <span className="text-muted-foreground">Description</span>
            </TableHead>
            <TableHead className="w-[120px]">
              <SortableHeader 
                label="Status" 
                field="status" 
                sortConfig={sortConfig} 
                onSort={onSort} 
              />
            </TableHead>
            <TableHead className="w-[100px]">
              <SortableHeader 
                label="Priority" 
                field="priority" 
                sortConfig={sortConfig} 
                onSort={onSort} 
              />
            </TableHead>
            <TableHead className="w-[120px]">
              <SortableHeader 
                label="Due Date" 
                field="dueDate" 
                sortConfig={sortConfig} 
                onSort={onSort} 
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskTableRow key={task.id} task={task} />
          ))}
        </TableBody>
      </Table>
    </div>
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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead className="w-[250px]">Description</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[100px]">Priority</TableHead>
            <TableHead className="w-[120px]">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse" /></TableCell>
              <TableCell><div className="h-4 bg-muted rounded w-48 animate-pulse" /></TableCell>
              <TableCell><div className="h-5 bg-muted rounded w-20 animate-pulse" /></TableCell>
              <TableCell><div className="h-5 bg-muted rounded w-16 animate-pulse" /></TableCell>
              <TableCell><div className="h-4 bg-muted rounded w-24 animate-pulse" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

  // Sorting state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'asc',
  })

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

  // Handle sorting
  const handleSort = useCallback((field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }, [])

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

  // Sort tasks client-side
  const sortedTasks = useMemo(() => {
    if (!sortConfig.field) return tasks

    return [...tasks].sort((a, b) => {
      const { field, direction } = sortConfig
      const multiplier = direction === 'asc' ? 1 : -1

      switch (field) {
        case 'title':
          return multiplier * a.title.localeCompare(b.title)
        case 'status':
          return multiplier * (STATUS_CONFIG[a.status].order - STATUS_CONFIG[b.status].order)
        case 'priority': {
          const aOrder = a.priority ? PRIORITY_CONFIG[a.priority].order : 0
          const bOrder = b.priority ? PRIORITY_CONFIG[b.priority].order : 0
          return multiplier * (aOrder - bOrder)
        }
        case 'dueDate': {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0
          return multiplier * (aDate - bDate)
        }
      default:
          return 0
      }
    })
  }, [tasks, sortConfig])

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
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
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
              {sortConfig.field && !loading && (
                <span className="ml-2 text-xs">
                  • Sorted by {sortConfig.field} ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                </span>
              )}
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

          {/* Task table */}
          {loading ? (
            <LoadingSkeleton />
          ) : sortedTasks.length === 0 ? (
            <EmptyState hasFilters={hasActiveFilters} />
          ) : (
            <TaskTable 
              tasks={sortedTasks} 
              sortConfig={sortConfig} 
              onSort={handleSort} 
            />
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
    </TooltipProvider>
  )
}
