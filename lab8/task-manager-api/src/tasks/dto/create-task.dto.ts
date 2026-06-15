import {
  IsString, IsNotEmpty, IsIn, IsOptional,
  MaxLength, IsArray, IsInt, ArrayMinSize,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва не може бути порожньою' })
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(['low', 'medium', 'high'], {
    message: 'Пріоритет має бути: low, medium або high',
  })
  priority: 'low' | 'medium' | 'high';

  // Необов'язковий масив id тегів для прив'язки при створенні
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  tagIds?: number[];
}
