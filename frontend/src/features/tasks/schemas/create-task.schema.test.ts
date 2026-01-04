import { describe, it, expect } from 'vitest'
import { createTaskSchema } from './create-task.schema'

describe('createTaskSchema', () => {
  describe('title validation', () => {
    it('should accept a valid title', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
      })

      expect(result.success).toBe(true)
    })

    it('should reject an empty title', () => {
      const result = createTaskSchema.safeParse({
        title: '',
        status: 'PENDING',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title')
      }
    })

    it('should reject a title that is too long (>255 chars)', () => {
      const result = createTaskSchema.safeParse({
        title: 'a'.repeat(256),
        status: 'PENDING',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title')
      }
    })

    it('should accept a title at max length (255 chars)', () => {
      const result = createTaskSchema.safeParse({
        title: 'a'.repeat(255),
        status: 'PENDING',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('status validation', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

      validStatuses.forEach((status) => {
        const result = createTaskSchema.safeParse({
          title: 'Test Task',
          status,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject invalid status values', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'INVALID_STATUS',
      })

      expect(result.success).toBe(false)
    })
  })

  describe('priority validation', () => {
    it('should accept valid priority values', () => {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH']

      validPriorities.forEach((priority) => {
        const result = createTaskSchema.safeParse({
          title: 'Test Task',
          status: 'PENDING',
          priority,
        })
        expect(result.success).toBe(true)
      })
    })

    it('should accept undefined priority (optional field)', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priority).toBeUndefined()
      }
    })

    it('should reject invalid priority values', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
        priority: 'URGENT',
      })

      expect(result.success).toBe(false)
    })
  })

  describe('description validation', () => {
    it('should accept a valid description', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
        description: 'This is a test description',
      })

      expect(result.success).toBe(true)
    })

    it('should accept an empty description', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
        description: '',
      })

      expect(result.success).toBe(true)
    })

    it('should accept undefined description (optional field)', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('dueDate validation', () => {
    it('should accept a valid date string', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
        dueDate: '2024-12-31',
      })

      expect(result.success).toBe(true)
    })

    it('should accept undefined dueDate (optional field)', () => {
      const result = createTaskSchema.safeParse({
        title: 'Test Task',
        status: 'PENDING',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('full task validation', () => {
    it('should accept a complete valid task', () => {
      const result = createTaskSchema.safeParse({
        title: 'Complete project documentation',
        description: 'Write comprehensive README and API docs',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2024-12-31',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Complete project documentation')
        expect(result.data.status).toBe('IN_PROGRESS')
        expect(result.data.priority).toBe('HIGH')
      }
    })

    it('should accept a minimal valid task', () => {
      const result = createTaskSchema.safeParse({
        title: 'Minimal Task',
        status: 'PENDING',
      })

      expect(result.success).toBe(true)
    })
  })
})

