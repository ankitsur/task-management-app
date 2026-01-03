import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CreateTaskForm } from '@/features/tasks/forms/create-task-form'

export const Route = createFileRoute('/tasks/new')({
  component: CreateTaskPage,
})

function CreateTaskPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-xl mx-auto p-6">
        {/* Back button */}
        <div className="mb-6 animate-in slide-in-from-left-4 duration-500">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              ←
            </div>
            Back to Tasks
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 animate-in slide-in-from-top-4 duration-700">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg animate-bounce">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Task
          </h1>
          <p className="text-gray-600">
            Let's add something amazing to your task list! 🚀
          </p>
        </div>

        {/* Form */}
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <CreateTaskForm
            onSuccess={() => navigate({ to: '/' })}
          />
        </div>
      </div>
    </div>
  )
}
