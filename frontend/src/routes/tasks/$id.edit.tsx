import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useTasksStore } from '@/store/tasks.store'
import { UpdateTaskForm } from '@/features/tasks/forms/update-task-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/tasks/$id/edit')({
  component: UpdateTaskPage,
})

function UpdateTaskPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { selectedTask, loading, error, fetchTaskById } = useTasksStore()

  useEffect(() => {
    fetchTaskById(id)
  }, [fetchTaskById, id])

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to={`/tasks/${id}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Task
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedTask) {
    return (
      <div className="p-6 max-w-xl mx-auto">
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
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <Link to={`/tasks/${id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Task
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Edit Task</h1>
        <p className="text-gray-600">Update the task details below.</p>
      </div>

      <div className="mt-6">
        <UpdateTaskForm
          task={selectedTask}
          onSuccess={() => navigate({ to: `/tasks/${id}` })}
        />
      </div>
    </div>
  )
}
