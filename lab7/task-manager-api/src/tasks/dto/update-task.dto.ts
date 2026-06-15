import { IsString, IsIn, IsOptional, MaxLength } from 'class-validator';

// UpdateTaskDto — всі поля опціональні: клієнт може оновити лише частину задачі.
// whitelist: true у ValidationPipe автоматично видаляє поля яких немає в цьому DTO.
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high'], {
    message: 'Пріоритет має бути: low, medium або high',
  })
  priority?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsIn(['pending', 'in-progress', 'done'], {
    message: 'Статус має бути: pending, in-progress або done',
  })
  status?: 'pending' | 'in-progress' | 'done';
}
