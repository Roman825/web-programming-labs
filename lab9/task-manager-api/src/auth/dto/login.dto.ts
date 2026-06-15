import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Введіть коректний email' })
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
