import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Реєстрація: делегуємо створення користувача UsersService
  async register(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.create(email, password);
    // Ніколи не повертаємо пароль у відповіді
    const { password: _pwd, ...result } = user;
    return result;
  }

  // Логін: перевірка облікових даних та видача JWT
  async login(email: string, plainPassword: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    // Однакове повідомлення для "не знайдено" і "невірний пароль" —
    // не розкриваємо чи існує користувач з таким email
    if (!user) {
      throw new UnauthorizedException('Невірні облікові дані');
    }

    // bcrypt.compare ОБОВ'ЯЗКОВО з await — без await повертає Promise (truthy!)
    const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Невірні облікові дані');
    }

    // Підписуємо JWT. payload містить sub (id) та email
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
