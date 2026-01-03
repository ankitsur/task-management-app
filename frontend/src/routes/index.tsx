import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import type { TaskStatus, TaskPriority } from '@/types/task'

export const Route = createFileRoute('/')({
  component: TaskListPage,
})

function TaskListPage() {
  const { tasks, pagination, loading, fetchTasks } = useTasksStore()
  const { showNotification } = useNotifications()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page when search changes
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset page when filters change (except for search since it's debounced)
  const handleFilterChange = (type: 'status' | 'priority' | 'pageSize', value: any) => {
    if (type === 'status') setStatusFilter(value)
    else if (type === 'priority') setPriorityFilter(value)
    else if (type === 'pageSize') setPageSize(value)
    setCurrentPage(1)
  }

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(statusFilter !== 'ALL' && { status: statusFilter }),
      ...(priorityFilter !== 'ALL' && { priority: priorityFilter }),
    }
    fetchTasks(params)
  }, [fetchTasks, currentPage, pageSize, debouncedSearchTerm, statusFilter, priorityFilter])

  // Tasks are now filtered by the backend, so we use them directly
  const filteredTasks = tasks

  const getStatusVariant = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING':
        return 'secondary'
      case 'IN_PROGRESS':
        return 'default'
      case 'COMPLETED':
        return 'outline'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getPriorityVariant = (priority?: TaskPriority) => {
    switch (priority) {
      case 'LOW':
        return 'secondary'
      case 'MEDIUM':
        return 'default'
      case 'HIGH':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleRetry = async () => {
    try {
      await fetchTasks()
      showNotification('success', 'Tasks loaded successfully!')
    } catch {
      showNotification('error', 'Failed to load tasks. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-slate-800 dark:via-purple-800 dark:to-indigo-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />

          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="animate-in slide-in-from-left-4 duration-700">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 dark:from-white dark:to-purple-100 bg-clip-text text-transparent">
                Task Management
              </h1>
              <p className="text-blue-100 dark:text-purple-100 text-lg">
                Organize, track, and accomplish your goals with style ✨
              </p>
            </div>
            <div className="animate-in slide-in-from-right-4 duration-700 delay-200 flex items-center gap-4">
              <ThemeToggle />
              <Link to="/tasks/new">
                <Button className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl group">
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  Create Task
                  <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    🚀
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-4 duration-500 delay-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              Smart Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-gray-300"
                />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-focus-within:w-full transition-all duration-300" />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(value) => handleFilterChange('status', value as TaskStatus | 'ALL')}>
                <SelectTrigger className="border-gray-200 hover:border-blue-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl">
                  <SelectItem value="ALL" className="hover:bg-blue-50 focus:bg-blue-50">All Statuses</SelectItem>
                  <SelectItem value="PENDING" className="hover:bg-yellow-50 focus:bg-yellow-50">⏳ Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS" className="hover:bg-blue-50 focus:bg-blue-50">🔄 In Progress</SelectItem>
                  <SelectItem value="COMPLETED" className="hover:bg-green-50 focus:bg-green-50">✅ Completed</SelectItem>
                  <SelectItem value="CANCELLED" className="hover:bg-red-50 focus:bg-red-50">❌ Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={(value) => handleFilterChange('priority', value as TaskPriority | 'ALL')}>
                <SelectTrigger className="border-gray-200 hover:border-purple-400 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl">
                  <SelectItem value="ALL" className="hover:bg-gray-50 focus:bg-gray-50">All Priorities</SelectItem>
                  <SelectItem value="LOW" className="hover:bg-green-50 focus:bg-green-50">🟢 Low</SelectItem>
                  <SelectItem value="MEDIUM" className="hover:bg-yellow-50 focus:bg-yellow-50">🟡 Medium</SelectItem>
                  <SelectItem value="HIGH" className="hover:bg-red-50 focus:bg-red-50">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Task Count & Pagination Info */}
        <div className="flex items-center justify-between animate-in slide-in-from-bottom-2 duration-500 delay-200">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium">
              📊 {pagination ? `${pagination.total} total tasks` : `${filteredTasks.length} tasks`}
            </div>
            {pagination && pagination.total > pagination.limit && (
              <div className="text-xs text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>
            )}
          </div>

          {/* Page Size Selector */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => handleFilterChange('pageSize', Number(value))}>
                <SelectTrigger className="w-20 h-8">
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

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="hover:scale-105 transition-transform duration-200"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="hover:scale-105 transition-transform duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i
                if (pageNum > pagination.totalPages) return null
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 hover:scale-105 transition-transform duration-200 ${
                      pageNum === currentPage
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : ''
                    }`}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className="hover:scale-105 transition-transform duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
              className="hover:scale-105 transition-transform duration-200"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-300">
            <CardContent className="text-center py-16">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse">
                  <Plus className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {tasks.length === 0
                    ? 'Create your first task to get started with task management!'
                    : 'No tasks match your current filters. Try adjusting your search criteria.'
                  }
                </p>
              </div>
              {tasks.length === 0 && (
                <Link to="/tasks/new">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Task
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task, index) => (
              <Card
                key={task.id}
                className="group relative overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2 transition-all duration-300 ease-out border-0 bg-gradient-to-br from-white to-gray-50 hover:from-white hover:to-blue-50/50 animate-in slide-in-from-bottom-4 fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-blue-900 transition-colors duration-200">
                      {task.title}
                    </CardTitle>
                    <Badge
                      variant={getStatusVariant(task.status)}
                      className="ml-2 flex-shrink-0 animate-in zoom-in-50 duration-300"
                    >
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.priority && (
                        <Badge
                          variant={getPriorityVariant(task.priority)}
                          className="text-xs transform hover:scale-110 transition-transform duration-200"
                        >
                          {task.priority}
                        </Badge>
                      )}
                      {task.dueDate && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-200 transition-colors duration-200">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link to={`/tasks/${task.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transform hover:scale-105 transition-all duration-200"
                      >
                        <span className="flex items-center gap-2">
                          View Details
                          <div className="w-0 group-hover:w-4 transition-all duration-200 overflow-hidden">
                            →
                          </div>
                        </span>
                      </Button>
                    </Link>
                    <Link to={`/tasks/${task.id}/edit`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700 transform hover:scale-105 transition-all duration-200"
                      >
                        <span className="flex items-center gap-2">
                          Edit
                          <div className="w-0 group-hover:w-4 transition-all duration-200 overflow-hidden">
                            ✏️
                          </div>
                        </span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>

                {/* Decorative elements */}
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform rotate-12" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 transform -rotate-12" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
