import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useTasksStore } from '@/store/tasks.store'
import { UpdateTaskForm } from '@/features/tasks/forms/update-task-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Edit2, FileText } from 'lucide-react'

export const Route = createFileRoute('/tasks/$id/edit')({
  component: UpdateTaskPage,
})

/* =============================================================================
   NOT FOUND STATE
============================================================================= */

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">
        <Card className="border border-border/60">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Task not found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              The task you're trying to edit doesn't exist or has been deleted.
            </p>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

function UpdateTaskPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  // Use the selectedTask that was already loaded by the parent route
  const { selectedTask } = useTasksStore()

  if (!selectedTask) {
    return <NotFoundState />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back navigation */}
        <div className="animate-fade-in">
          <Link to={`/tasks/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Task
            </Button>
          </Link>
        </div>

        {/* Header */}
        <header className="space-y-2 animate-fade-in stagger-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Edit2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Edit Task
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Update the details of your task
          </p>
        </header>

        {/* Form */}
        <div className="animate-fade-in stagger-2">
          <UpdateTaskForm
            task={selectedTask}
            onSuccess={() => navigate({ to: `/tasks/${id}` })}
          />
        </div>
      </div>
    </div>
  )
}
