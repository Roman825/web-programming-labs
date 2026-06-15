import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../tags/tag.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'done';

  @Column({ default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @CreateDateColumn()
  createdAt: Date;

  // ManyToMany: задача може мати багато тегів, тег — багато задач.
  // @JoinTable() ставиться лише на одній стороні — Task є власником зв'язку.
  // onDelete: 'CASCADE' — при видаленні задачі/тега записи у junction-таблиці прибираються автоматично.
  @ManyToMany(() => Tag, { onDelete: 'CASCADE', eager: false })
  @JoinTable({ name: 'task_tags' })
  tags: Tag[];
}
