import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  // Масив задач в оперативній пам'яті (скидається при перезапуску сервера).
  // В наступних ЛР буде замінено на базу даних через TypeORM.
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
      title: 'Розробити REST API для задач',
      description: 'Реалізувати CRUD-ендпоінти через NestJS Controller',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2025-01-10T09:30:00.000Z',
    },
    {
      id: '3',
      title: 'Написати unit-тести',
      description: 'Покрити тестами контролер та сервіси через Jest',
      status: 'pending',
      priority: 'medium',
      createdAt: '2025-01-15T14:00:00.000Z',
    },
    {
      id: '4',
      title: 'Оновити документацію API',
      description: 'Описати всі ендпоінти у README.md',
      status: 'pending',
      priority: 'low',
      createdAt: '2025-01-20T11:00:00.000Z',
    },
  ];

  // GET /tasks — повертає весь масив задач
  @Get()
  findAll(): Task[] {
    return this.tasks;
  }

  // GET /tasks/search?status=pending
  // Цей маршрут ОБОВ'ЯЗКОВО оголошується ДО @Get(':id'),
  // інакше NestJS трактує рядок 'search' як значення параметра id
  @Get('search')
  findByStatus(@Query('status') status?: string): Task[] {
    if (!status) {
      // Якщо параметр не передано — повертаємо всі задачі
      return this.tasks;
    }
    // Фільтруємо масив за полем status
    return this.tasks.filter((task) => task.status === status);
  }

  // GET /tasks/:id — знайти одну задачу за id
  @Get(':id')
  findOne(@Param('id') id: string): Task | { message: string } {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      return { message: `Задачу з id=${id} не знайдено` };
    }
    return task;
  }

  // POST /tasks — створити нову задачу
  // id генерується як Date.now().toString() для унікальності
  @Post()
  create(@Body() dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title: dto.title,
      description: dto.description ?? '',
      status: 'pending', // нова задача завжди має статус pending
      priority: dto.priority,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  // DELETE /tasks/:id — видалити задачу за id
  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return { message: `Задачу з id=${id} не знайдено` };
    }
    this.tasks.splice(index, 1);
    return { message: `Задачу з id=${id} успішно видалено` };
  }
}
