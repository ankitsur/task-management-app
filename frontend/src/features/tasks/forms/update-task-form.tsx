import { useState } from 'react'
import { createTaskSchema, CreateTaskInput } from '../schemas/create-task.schema'
import { useTasksStore } from '@/store/tasks.store'
import { useNotifications } from '@/contexts/notification.context'
import type { Task } from '@/types/task'

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
  task: Task
  onSuccess: () => void
}

export function UpdateTaskForm({ task, onSuccess }: Props) {
  const updateTask = useTasksStore((s) => s.updateTask)
  const { showNotification } = useNotifications()

  const [values, setValues] = useState<CreateTaskInput>({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
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
      await updateTask(task.id, result.data)
      showNotification('success', 'Task updated successfully!')
      onSuccess()
    } catch (error) {
      showNotification('error', 'Failed to update task. Please try again.')
      console.error('Update task error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <Input
          placeholder="Task title"
          value={values.title}
          onChange={(e) =>
            setValues({ ...values, title: e.target.value })
          }
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          placeholder="Task description (optional)"
          value={values.description ?? ''}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          rows={4}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select
          value={values.status}
          onValueChange={(value) =>
            setValues({ ...values, status: value as CreateTaskInput['status'] })
          }
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
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <Select
          value={values.priority}
          onValueChange={(value) =>
            setValues({ ...values, priority: value as CreateTaskInput['priority'] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Due Date - TODO: Add date picker */}
      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <Input
          type="date"
          value={values.dueDate ? new Date(values.dueDate).toISOString().split('T')[0] : ''}
          onChange={(e) => {
            const dateValue = e.target.value ? new Date(e.target.value).toISOString() : undefined
            setValues({ ...values, dueDate: dateValue })
          }}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Updating…' : 'Update Task'}
      </Button>
    </form>
  )
}
