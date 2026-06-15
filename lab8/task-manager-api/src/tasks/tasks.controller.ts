import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, NotFoundException, ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('search')
  findByStatus(@Query('status') status?: string): Promise<Task[]> {
    return this.tasksService.findByStatus(status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    const task = await this.tasksService.findOne(id);
    if (!task) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return task;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.tasksService.update(id, dto);
    if (!task) throw new NotFoundException(`Завдання #${id} не знайдено`);
    return task;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const removed = await this.tasksService.remove(id);
    if (!removed) throw new NotFoundException(`Завдання #${id} не знайдено`);
  }
}
