import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'
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

  useEffect(() => {
    fetchTaskById(id)
  }, [fetchTaskById, id])

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id)
        showNotification('success', 'Task deleted successfully!')
        navigate({ to: '/' })
      } catch (error) {
        showNotification('error', 'Failed to delete task. Please try again.')
        console.error('Failed to delete task:', error)
      }
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to={`/tasks/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{selectedTask.title}</span>
            <Badge variant={getStatusVariant(selectedTask.status)}>
              {selectedTask.status.replace('_', ' ')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedTask.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedTask.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <Badge variant={getStatusVariant(selectedTask.status)}>
                {selectedTask.status.replace('_', ' ')}
              </Badge>
            </div>

            {selectedTask.priority && (
              <div>
                <h3 className="font-semibold mb-2">Priority</h3>
                <Badge variant={getPriorityVariant(selectedTask.priority)}>
                  {selectedTask.priority}
                </Badge>
              </div>
            )}
          </div>

          {selectedTask.dueDate && (
            <div>
              <h3 className="font-semibold mb-2">Due Date</h3>
              <p className="text-gray-700">
                {new Date(selectedTask.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(selectedTask.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{' '}
              {new Date(selectedTask.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
