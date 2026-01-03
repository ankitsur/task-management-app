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

/* =============================================================================
   TYPES
============================================================================= */

interface CreateTaskFormProps {
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
   MAIN FORM COMPONENT
============================================================================= */

export function CreateTaskForm({ onSuccess }: CreateTaskFormProps) {
  const createTask = useTasksStore((state) => state.createTask)
  const { showNotification } = useNotifications()

  // Default status to PENDING (matches backend default)
  const [formValues, setFormValues] = useState<CreateTaskInput>({
    title: '',
    status: 'PENDING',
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Validate form data
    const result = createTaskSchema.safeParse(formValues)

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
      await createTask(result.data)
      showNotification('success', 'Task created successfully')
      onSuccess()
    } catch (error) {
      showNotification('error', 'Failed to create task. Please try again.')
      console.error('Create task error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              autoFocus
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
                value={formValues.priority ?? ''}
                onValueChange={(value) =>
                  updateField('priority', value as CreateTaskInput['priority'])
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No priority" />
                </SelectTrigger>
                <SelectContent>
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
              value={
                formValues.dueDate
                  ? new Date(formValues.dueDate).toISOString().split('T')[0]
                  : ''
              }
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
                  Creating...
                </>
              ) : (
                'Create Task'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
