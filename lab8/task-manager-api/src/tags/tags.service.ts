import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async findOne(id: number): Promise<Tag | null> {
    return this.tagsRepository.findOne({ where: { id } });
  }

  create(dto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(dto);
    return this.tagsRepository.save(tag);
  }

  async update(id: number, dto: Partial<CreateTagDto>): Promise<Tag | null> {
    const tag = await this.findOne(id);
    if (!tag) return null;
    Object.assign(tag, dto);
    return this.tagsRepository.save(tag);
  }

  async remove(id: number): Promise<boolean> {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) return false;
    await this.tagsRepository.remove(tag);
    return true;
  }
}
