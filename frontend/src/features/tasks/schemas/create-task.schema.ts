import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),

  description: z
    .string()
    .optional(),

  status: z
    .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional(),

  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .optional(),

  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'Invalid date format'
    }),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
