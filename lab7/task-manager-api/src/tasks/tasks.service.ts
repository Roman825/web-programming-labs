import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Сервіс відповідає виключно за операції з даними.
// Він НЕ знає про HTTP — не кидає NotFoundException і подібні.
// При відсутності ресурсу повертає null або false, а контролер вже кидає виключення.
@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'Налаштувати середовище розробки',
      description: 'Встановити Node.js, VS Code та розширення NestJS',
      status: 'done',
      priority: 'high',
      createdAt: '2025-01-05T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Розробити CRUD API',
      description: 'Реалізувати сервіс, контролер, DTO та ValidationPipe',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2025-01-10T09:30:00.000Z',
    },
    {
      id: '3',
      title: 'Написати unit-тести',
      description: 'Покрити тестами TasksService через Jest',
      status: 'pending',
      priority: 'medium',
      createdAt: '2025-01-15T14:00:00.000Z',
    },
    {
      id: '4',
      title: 'Оновити документацію',
      description: 'Описати всі ендпоінти у README.md',
      status: 'pending',
      priority: 'low',
      createdAt: '2025-01-20T11:00:00.000Z',
    },
  ];

  // GET /tasks — повертає весь масив
  findAll(): Task[] {
    return this.tasks;
  }

  // GET /tasks/search?status= — фільтр за статусом
  findByStatus(status?: string): Task[] {
    if (!status) return this.tasks;
    return this.tasks.filter((t) => t.status === status);
  }

  // GET /tasks/:id — повертає null якщо не знайдено
  findOne(id: string): Task | null {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  // POST /tasks — створює нову задачу
  create(dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title: dto.title,
      description: dto.description ?? '',
      status: 'pending',
      priority: dto.priority,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // PATCH /tasks/:id — часткове оновлення, повертає null якщо не знайдено
  update(id: string, dto: UpdateTaskDto): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    // spread оновлює лише передані поля, інші залишаються без змін
    this.tasks[index] = { ...this.tasks[index], ...dto };
    return this.tasks[index];
  }

  // DELETE /tasks/:id — повертає false якщо не знайдено
  remove(id: string): boolean {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}
