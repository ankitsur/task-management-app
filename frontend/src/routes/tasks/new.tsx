import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CreateTaskForm } from '@/features/tasks/forms/create-task-form'

export const Route = createFileRoute('/tasks/new')({
  component: CreateTaskPage,
})

function CreateTaskPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Task</h1>

      <CreateTaskForm
        onSuccess={() => navigate({ to: '/' })}
      />
    </div>
  )
}
