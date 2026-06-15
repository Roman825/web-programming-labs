import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'Назва тега не може бути порожньою' })
  @MaxLength(50)
  name: string;
}
