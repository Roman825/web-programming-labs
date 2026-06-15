import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) { return this.repo.findOne({ where: { email } }); }
  findById(id: number) { return this.repo.findOne({ where: { id } }); }

  async create(email: string, plainPassword: string): Promise<User> {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email вже використовується');
    const password = await bcrypt.hash(plainPassword, 10);
    return this.repo.save(this.repo.create({ email, password }));
  }
}
