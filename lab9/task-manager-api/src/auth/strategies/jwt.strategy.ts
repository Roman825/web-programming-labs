import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// JwtPayload — структура даних всередині токена
export interface JwtPayload {
  sub: number;   // id користувача
  email: string;
}

// Об'єкт що Passport кладе у request.user після validate()
export interface AuthUser {
  id: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Витягуємо токен з заголовка Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Відхиляємо прострочені токени
      ignoreExpiration: false,
      // Секрет для перевірки підпису — той самий що й при видачі токена
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // validate() викликається після перевірки підпису.
  // Повертає об'єкт що Passport покладе у request.user
  validate(payload: JwtPayload): AuthUser {
    return { id: payload.sub, email: payload.email };
  }
}
