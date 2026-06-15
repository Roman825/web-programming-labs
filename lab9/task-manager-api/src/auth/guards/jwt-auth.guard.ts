import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard — обгортка над стандартним AuthGuard('jwt').
// При невалідному або відсутньому токені автоматично повертає 401 Unauthorized.
// Використовується через @UseGuards(JwtAuthGuard) на захищених ендпоінтах.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
