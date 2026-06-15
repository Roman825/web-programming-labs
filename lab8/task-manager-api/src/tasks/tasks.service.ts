import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './task.entity';
import { Tag } from '../tags/tag.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  // Завантажуємо задачі разом із тегами через relations
  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: { tags: true } });
  }

  async findByStatus(status?: string): Promise<Task[]> {
    if (!status) {
      return this.tasksRepository.find({ relations: { tags: true } });
    }
    return this.tasksRepository.find({
      where: { status: status as any },
      relations: { tags: true },
    });
  }

  async findOne(id: number): Promise<Task | null> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      priority: dto.priority,
      status: 'pending',
    });

    // Якщо передані tagIds — завантажуємо теги і прив'язуємо
    if (dto.tagIds && dto.tagIds.length > 0) {
      const tags = await this.tagsRepository.findBy({ id: In(dto.tagIds) });
      task.tags = tags;
    } else {
      task.tags = [];
    }

    return this.tasksRepository.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.findOne(id);
    if (!task) return null;
    // Оновлюємо лише передані поля через spread
    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<boolean> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) return false;
    await this.tasksRepository.remove(task);
    return true;
  }
}
