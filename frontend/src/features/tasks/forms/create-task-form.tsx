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
    <div className="bg-white rounded-2xl shadow-xl border-0 p-8 space-y-6 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2 animate-in slide-in-from-left-4 duration-500">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Task Title *
          </label>
          <Input
            placeholder="Enter an amazing task title..."
            value={values.title}
            onChange={(e) =>
              setValues({ ...values, title: e.target.value })
            }
            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200 hover:border-gray-300 text-lg py-3"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1 animate-in slide-in-from-top-2 duration-300">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 animate-in slide-in-from-right-4 duration-500 delay-100">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></span>
            Description
          </label>
          <Textarea
            placeholder="Add some details about your task... (optional)"
            value={values.description ?? ''}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            rows={4}
            className="border-gray-200 focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-200 hover:border-gray-300 resize-none"
          />
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-500 delay-200">
          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-400"></span>
              Status
            </label>
            <Select
              onValueChange={(value) =>
                setValues({ ...values, status: value as CreateTaskInput['status'] })
              }
            >
              <SelectTrigger className="border-gray-200 focus:border-green-400 focus:ring-green-400/20 transition-all duration-200 hover:border-gray-300">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="border-0 shadow-xl">
                <SelectItem value="PENDING" className="hover:bg-yellow-50">⏳ Pending</SelectItem>
                <SelectItem value="IN_PROGRESS" className="hover:bg-blue-50">🔄 In Progress</SelectItem>
                <SelectItem value="COMPLETED" className="hover:bg-green-50">✅ Completed</SelectItem>
                <SelectItem value="CANCELLED" className="hover:bg-red-50">❌ Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-600"></span>
              Priority
            </label>
            <Select
              onValueChange={(value) =>
                setValues({ ...values, priority: value as CreateTaskInput['priority'] })
              }
            >
              <SelectTrigger className="border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-200 hover:border-gray-300">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="border-0 shadow-xl">
                <SelectItem value="LOW" className="hover:bg-green-50">🟢 Low</SelectItem>
                <SelectItem value="MEDIUM" className="hover:bg-yellow-50">🟡 Medium</SelectItem>
                <SelectItem value="HIGH" className="hover:bg-red-50">🔴 High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-800"></span>
            Due Date
          </label>
          <Input
            type="date"
            onChange={(e) => {
              const dateValue = e.target.value ? new Date(e.target.value).toISOString() : undefined
              setValues({ ...values, dueDate: dateValue })
            }}
            className="border-gray-200 focus:border-pink-400 focus:ring-pink-400/20 transition-all duration-200 hover:border-gray-300"
          />
          {errors.dueDate && (
            <p className="text-sm text-red-500 mt-1 animate-in slide-in-from-top-2 duration-300">{errors.dueDate}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 animate-in slide-in-from-bottom-4 duration-500 delay-400">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl py-3 text-lg font-semibold"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Task...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                ✨ Create Task
                <span className="animate-bounce">🚀</span>
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
