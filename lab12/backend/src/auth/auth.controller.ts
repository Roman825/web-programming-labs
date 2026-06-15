import { Controller, Post, Get, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext) =>
  ctx.switchToHttp().getRequest().user
);

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register') @HttpCode(201)
  register(@Body() body: { email: string; password: string }) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login') @HttpCode(200)
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @Get('me') @UseGuards(AuthGuard('jwt'))
  me(@CurrentUser() user: any) { return user; }
}
