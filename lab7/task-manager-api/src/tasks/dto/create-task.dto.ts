import { IsString, IsNotEmpty, IsIn, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва не може бути порожньою' })
  @MaxLength(100, { message: 'Назва не може перевищувати 100 символів' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Опис не може перевищувати 500 символів' })
  description?: string;

  @IsIn(['low', 'medium', 'high'], {
    message: 'Пріоритет має бути: low, medium або high',
  })
  priority: 'low' | 'medium' | 'high';
}
