import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn() id: number;
  @Column({ length: 100 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string | null;
  @Column({ default: 'pending' }) status: string;
  @Column({ default: 'medium' }) priority: string;
  @CreateDateColumn() createdAt: Date;
}
