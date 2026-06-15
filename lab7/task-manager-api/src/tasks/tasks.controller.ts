import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

// Контролер відповідає за HTTP-рівень:
// - приймає запити та перевіряє результат від сервісу
// - кидає HTTP-виключення (NotFoundException → 404) при потребі
// - НЕ містить логіки роботи з даними — це відповідальність сервісу
@Controller('tasks')
export class TasksController {
  // Dependency Injection: NestJS сам створить екземпляр TasksService та передасть сюди
  constructor(private readonly tasksService: TasksService) {}

  // GET /tasks → 200
  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  // GET /tasks/search?status=pending → 200
  // ВАЖЛИВО: оголошується ДО @Get(':id') щоб 'search' не трактувалось як :id
  @Get('search')
  findByStatus(@Query('status') status?: string): Task[] {
    return this.tasksService.findByStatus(status);
  }

  // GET /tasks/:id → 200 або 404
  @Get(':id')
  findOne(@Param('id') id: string): Task {
    const task = this.tasksService.findOne(id);
    if (!task) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return task;
  }

  // POST /tasks → 201 або 400 (при невалідних даних — ValidationPipe)
  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTaskDto): Task {
    return this.tasksService.create(dto);
  }

  // PATCH /tasks/:id → 200 або 400 або 404
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto): Task {
    const task = this.tasksService.update(id, dto);
    if (!task) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return task;
  }

  // DELETE /tasks/:id → 204 (без тіла відповіді) або 404
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    const removed = this.tasksService.remove(id);
    if (!removed) throw new NotFoundException(`Завдання #${id} не знайдено`);
  }
}
