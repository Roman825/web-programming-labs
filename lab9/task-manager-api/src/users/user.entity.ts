import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // unique: true — email має бути унікальним (інакше 409 Conflict при реєстрації)
  @Column({ unique: true })
  email: string;

  // Зберігаємо ТІЛЬКИ хеш пароля, ніколи не відкритий текст
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
