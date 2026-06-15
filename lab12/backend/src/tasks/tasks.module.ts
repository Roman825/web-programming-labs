import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller, Get, Post, Body, Param, Delete, HttpCode, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';

@Injectable()
class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(dto: Partial<Task>) { return this.repo.save(this.repo.create(dto)); }
  async remove(id: number) { await this.repo.delete(id); }
}

@Controller('tasks')
class TasksController {
  constructor(private svc: TasksService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
  @Post() @HttpCode(201) create(@Body() body: Partial<Task>) { return this.svc.create(body); }
  @Delete(':id') @HttpCode(204) remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
