import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, HttpCode, NotFoundException, ParseIntPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagsService.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateTagDto,
  ): Promise<Tag> {
    const tag = await this.tagsService.update(id, dto);
    if (!tag) throw new NotFoundException(`Тег #${id} не знайдено`);
    return tag;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const removed = await this.tagsService.remove(id);
    if (!removed) throw new NotFoundException(`Тег #${id} не знайдено`);
  }
}
