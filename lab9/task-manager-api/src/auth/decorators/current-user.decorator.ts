import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../strategies/jwt.strategy';

// @CurrentUser() — власний декоратор параметра.
// Замість @Req() req + req.user можна писати @CurrentUser() user.
// Це робить код чистішим і не прив'язує контролер до Express Request.
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
