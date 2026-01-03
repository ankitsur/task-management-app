import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.enum';

@Entity('tasks')
@Index('idx_tasks_status', ['status'])
@Index('idx_tasks_priority', ['priority'])
@Index('idx_tasks_due_date', ['dueDate'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status!: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    nullable: true,
  })
  priority?: TaskPriority;

  @Column({ name: 'due_date', type: 'timestamp', nullable: true })
  dueDate?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
