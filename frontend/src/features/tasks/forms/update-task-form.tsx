import { useState, useCallback } from 'react'
import { createTaskSchema, CreateTaskInput } from '../schemas/create-task.schema'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import type { Task } from '@/types/task'

/* =============================================================================
   TYPES
============================================================================= */

interface UpdateTaskFormProps {
  task: Task
  onSuccess: () => void
}

interface FormFieldProps {
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}

/* =============================================================================
   FORM FIELD COMPONENT
============================================================================= */

function FormField({ label, required, hint, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {hint && (
          <span className="text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}

/* =============================================================================
   HELPER FUNCTIONS
============================================================================= */

function formatDateForInput(dateString: string | undefined | null): string {
  if (!dateString) return ''
  try {
    return new Date(dateString).toISOString().split('T')[0]
  } catch {
    return ''
  }
}

// Special value to represent "no priority" in the select
const NO_PRIORITY_VALUE = '__NO_PRIORITY__'

/* =============================================================================
   MAIN FORM COMPONENT
============================================================================= */

export function UpdateTaskForm({ task, onSuccess }: UpdateTaskFormProps) {
  const updateTask = useTasksStore((state) => state.updateTask)
  const { showNotification } = useNotifications()

  // Initialize form with existing task values
  // Note: priority can be null/undefined from the backend
  const [formValues, setFormValues] = useState<CreateTaskInput>({
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority ?? undefined,
    dueDate: task.dueDate ?? undefined,
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback(
    <K extends keyof CreateTaskInput>(field: K, value: CreateTaskInput[K]) => {
      setFormValues((prev) => ({ ...prev, [field]: value }))
      // Clear error when field is modified
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const updated = { ...prev }
          delete updated[field]
          return updated
        })
      }
    },
    [fieldErrors]
  )

  const handlePriorityChange = useCallback((value: string) => {
    // If user selects "No priority", set to undefined
    if (value === NO_PRIORITY_VALUE) {
      updateField('priority', undefined)
    } else {
      updateField('priority', value as CreateTaskInput['priority'])
    }
  }, [updateField])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Clean form data: ensure empty strings become undefined for optional fields
    const cleanedData: CreateTaskInput = {
      title: formValues.title.trim(),
      description: formValues.description?.trim() || undefined,
      status: formValues.status,
      priority: formValues.priority || undefined,
      dueDate: formValues.dueDate || undefined,
    }

    // Validate form data
    const result = createTaskSchema.safeParse(cleanedData)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]
        if (typeof path === 'string') {
          errors[path] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      await updateTask(task.id, result.data)
      showNotification('success', 'Task updated successfully')
      onSuccess()
    } catch (error) {
      showNotification('error', 'Failed to update task. Please try again.')
      console.error('Update task error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Compute select value for priority - use special value for "no priority"
  const prioritySelectValue = formValues.priority ?? NO_PRIORITY_VALUE

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <FormField label="Title" required error={fieldErrors.title}>
            <Input
              placeholder="Enter task title"
              value={formValues.title}
              onChange={(e) => updateField('title', e.target.value)}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Description */}
          <FormField label="Description" hint="Optional" error={fieldErrors.description}>
            <Textarea
              placeholder="Add details about this task..."
              value={formValues.description ?? ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              disabled={isSubmitting}
              className="resize-none"
            />
          </FormField>

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Status">
              <Select
                value={formValues.status ?? 'PENDING'}
                onValueChange={(value) =>
                  updateField('status', value as CreateTaskInput['status'])
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Priority" hint="Optional">
              <Select
                value={prioritySelectValue}
                onValueChange={handlePriorityChange}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_PRIORITY_VALUE}>No priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          {/* Due Date */}
          <FormField label="Due Date" hint="Optional" error={fieldErrors.dueDate}>
            <Input
              type="date"
              value={formatDateForInput(formValues.dueDate)}
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined
                updateField('dueDate', dateValue)
              }}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Submit button */}
          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
