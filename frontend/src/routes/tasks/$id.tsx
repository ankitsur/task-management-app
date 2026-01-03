import { createFileRoute, useNavigate, Link, Outlet, useMatch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react'
import type { TaskStatus, TaskPriority } from '@/types/task'

export const Route = createFileRoute('/tasks/$id')({
  component: TaskDetailLayout,
})

/* =============================================================================
   CONFIGURATION
============================================================================= */

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  PENDING: { label: 'Pending', variant: 'secondary' },
  IN_PROGRESS: { label: 'In Progress', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'outline' },
  CANCELLED: { label: 'Cancelled', variant: 'destructive' },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  LOW: {
    label: 'Low Priority',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  MEDIUM: {
    label: 'Medium Priority',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  HIGH: {
    label: 'High Priority',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  },
}

/* =============================================================================
   HELPER FUNCTIONS
============================================================================= */

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTimestamp(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* =============================================================================
   LOADING STATE
============================================================================= */

function LoadingState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        <Card className="border border-border">
          <CardContent className="p-6 space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-8 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-24" />
              </div>
              <div className="h-20 bg-muted rounded" />
              <div className="flex gap-4">
                <div className="h-10 bg-muted rounded w-32" />
                <div className="h-10 bg-muted rounded w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* =============================================================================
   ERROR STATE
============================================================================= */

interface ErrorStateProps {
  message: string
}

function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-6">{message}</p>
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
   NOT FOUND STATE
============================================================================= */

function NotFoundState() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Task not found
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              The task you're looking for doesn't exist or has been deleted.
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
   METADATA ITEM COMPONENT
============================================================================= */

interface MetadataItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <div className="text-muted-foreground mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  )
}

/* =============================================================================
   LAYOUT COMPONENT (handles both detail and edit as child)
============================================================================= */

function TaskDetailLayout() {
  const { id } = Route.useParams()
  const { selectedTask, loading, error, fetchTaskById } = useTasksStore()
  
  // Check if we're on the edit child route
  const editMatch = useMatch({ from: '/tasks/$id/edit', shouldThrow: false })
  const isEditRoute = Boolean(editMatch)

  useEffect(() => {
    fetchTaskById(id)
  }, [fetchTaskById, id])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!selectedTask) {
    return <NotFoundState />
  }

  // If on edit route, render the child route (edit form)
  if (isEditRoute) {
    return <Outlet />
  }

  // Otherwise render the detail view
  return <TaskDetailView id={id} />
}

/* =============================================================================
   DETAIL VIEW COMPONENT
============================================================================= */

interface TaskDetailViewProps {
  id: string
}

function TaskDetailView({ id }: TaskDetailViewProps) {
  const navigate = useNavigate()
  const { selectedTask, deleteTask } = useTasksStore()
  const { showNotification } = useNotifications()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(id)
      showNotification('success', 'Task deleted successfully')
      navigate({ to: '/' })
    } catch (err) {
      showNotification('error', 'Failed to delete task. Please try again.')
      console.error('Failed to delete task:', err)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  if (!selectedTask) {
    return <NotFoundState />
  }

  const statusConfig = STATUS_CONFIG[selectedTask.status]
  const priorityConfig = selectedTask.priority
    ? PRIORITY_CONFIG[selectedTask.priority]
    : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Link to={`/tasks/${id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Main content card */}
        <Card className="border border-border">
          <CardContent className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-semibold text-foreground leading-tight">
                {selectedTask.title}
              </h1>
              <Badge variant={statusConfig.variant} className="shrink-0">
                {statusConfig.label}
              </Badge>
            </div>

            {/* Priority badge */}
            {priorityConfig && (
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${priorityConfig.className}`}
                >
                  {priorityConfig.label}
                </span>
              </div>
            )}

            {/* Description */}
            {selectedTask.description && (
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Description
                </h2>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>
            )}

            {/* Due date */}
            {selectedTask.dueDate && (
              <MetadataItem
                icon={<Calendar className="h-4 w-4" />}
                label="Due Date"
                value={formatDateTime(selectedTask.dueDate)}
              />
            )}

            {/* Timestamps */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <MetadataItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Created"
                  value={formatTimestamp(selectedTask.createdAt)}
                />
                <MetadataItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Last Updated"
                  value={formatTimestamp(selectedTask.updatedAt)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${selectedTask.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}
