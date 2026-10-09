import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../user.entity';

export type JwtPayload = { sub: string; role: Role };

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): JwtPayload =>
        ctx.switchToHttp().getRequest().user,
);