import { useState } from 'react'
import { createTaskSchema, CreateTaskInput } from '../schemas/create-task.schema'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Props {
  onSuccess: () => void
}

export function CreateTaskForm({ onSuccess }: Props) {
  const createTask = useTasksStore((s) => s.createTask)
  const { showNotification } = useNotifications()

  const [values, setValues] = useState<CreateTaskInput>({
    title: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = createTaskSchema.safeParse(values)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await createTask(result.data)
      showNotification('success', 'Task created successfully!')
      onSuccess()
    } catch (error) {
      showNotification('error', 'Failed to create task. Please try again.')
      console.error('Create task error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <Input
          placeholder="Title"
          value={values.title}
          onChange={(e) =>
            setValues({ ...values, title: e.target.value })
          }
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <Textarea
        placeholder="Description (optional)"
        value={values.description ?? ''}
        onChange={(e) =>
          setValues({ ...values, description: e.target.value })
        }
      />

      {/* Status */}
      <Select
        onValueChange={(value) =>
          setValues({ ...values, status: value as CreateTaskInput['status'] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority */}
      <Select
        onValueChange={(value) =>
          setValues({ ...values, priority: value as CreateTaskInput['priority'] })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
        </SelectContent>
      </Select>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <Input
          type="date"
          onChange={(e) => {
            const dateValue = e.target.value ? new Date(e.target.value).toISOString() : undefined
            setValues({ ...values, dueDate: dateValue })
          }}
        />
        {errors.dueDate && (
          <p className="text-sm text-red-500 mt-1">{errors.dueDate}</p>
        )}
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Creating…' : 'Create Task'}
      </Button>
    </form>
  )
}
