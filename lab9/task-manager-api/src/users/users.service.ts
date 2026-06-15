import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Пошук за email — використовується в AuthService
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(email: string, plainPassword: string): Promise<User> {
    // Перевіряємо чи існує користувач з таким email
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException('Користувач з таким email вже існує');
    }

    // Хешуємо пароль з cost factor 10 — ніколи не зберігаємо відкритий текст
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }
}
