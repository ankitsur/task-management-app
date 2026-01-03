import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/tasks/$id')({
  component: TaskDetailPage,
})

function TaskDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { selectedTask, loading, error, fetchTaskById, deleteTask } = useTasksStore()
  const { showNotification } = useNotifications()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchTaskById(id)
  }, [fetchTaskById, id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(id)
      showNotification('success', 'Task deleted successfully!')
      navigate({ to: '/' })
    } catch (error) {
      showNotification('error', 'Failed to delete task. Please try again.')
      console.error('Failed to delete task:', error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const getStatusVariant = (status: string) => {
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

  const getPriorityVariant = (priority?: string) => {
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
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedTask) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Task not found</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header with back button and actions */}
        <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
          <Link to="/">
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
          <div className="flex gap-3 animate-in slide-in-from-right-4 duration-500 delay-100">
            <Link to={`/tasks/${id}/edit`}>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md border-blue-200 hover:border-blue-400 hover:bg-blue-50">
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="hover:scale-105 transition-transform duration-200 shadow-sm hover:shadow-md"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Task Content Card */}
        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedTask.title}
              </CardTitle>
              <Badge
                variant={getStatusVariant(selectedTask.status)}
                className="animate-in zoom-in-50 duration-500 text-sm px-3 py-1"
              >
                {selectedTask.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedTask.description && (
              <div className="animate-in slide-in-from-left-4 duration-500 delay-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">Description</h3>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedTask.description}</p>
                </div>
              </div>
            )}

            {/* Status and Priority Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500 delay-400">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">Status</h3>
                </div>
                <Badge
                  variant={getStatusVariant(selectedTask.status)}
                  className="text-base px-4 py-2 w-fit hover:scale-105 transition-transform duration-200"
                >
                  {selectedTask.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">Priority</h3>
                </div>
                <Badge
                  variant={selectedTask.priority ? getPriorityVariant(selectedTask.priority) : 'secondary'}
                  className="text-base px-4 py-2 w-fit hover:scale-105 transition-transform duration-200"
                >
                  {selectedTask.priority || 'Not set'}
                </Badge>
              </div>
            </div>

            {selectedTask.dueDate && (
              <div className="animate-in slide-in-from-bottom-4 duration-500 delay-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-800">Due Date</h3>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-lg border-l-4 border-pink-400">
                  <p className="text-lg font-medium text-gray-800">
                    {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="border-t pt-6 animate-in slide-in-from-bottom-4 duration-500 delay-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Created</div>
                  <div className="font-medium text-gray-800">
                    {new Date(selectedTask.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                  <div className="font-medium text-gray-800">
                    {new Date(selectedTask.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${selectedTask?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
