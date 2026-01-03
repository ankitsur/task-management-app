import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { CreateTaskForm } from '@/features/tasks/forms/create-task-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FilePlus } from 'lucide-react'

export const Route = createFileRoute('/tasks/new')({
  component: CreateTaskPage,
})

function CreateTaskPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back navigation */}
        <div className="animate-fade-in">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-2 animate-fade-in stagger-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FilePlus className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Create Task
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Add a new task to your list
          </p>
        </header>

        {/* Form */}
        <div className="animate-fade-in stagger-2">
          <CreateTaskForm onSuccess={() => navigate({ to: '/' })} />
        </div>
      </div>
    </div>
  )
}
