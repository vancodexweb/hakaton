import {
    CanActivate, ExecutionContext, ForbiddenException,
    Injectable, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { ROLES_KEY } from './decorators/roles.decorator';
import { JwtPayload } from './decorators/current-user.decorator';
import { Role } from './user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const targets = [context.getHandler(), context.getClass()];

        // 1. Открытый маршрут — пропускаем без проверки
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets);
        if (isPublic) return true;

        // 2. Достаём токен из куки
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.access_token;
        if (!token) throw new UnauthorizedException();

        // 3. Проверяем подпись и срок жизни
        let payload: JwtPayload;
        try {
            payload = await this.jwtService.verifyAsync<JwtPayload>(token);
        } catch {
            throw new UnauthorizedException();
        }
        request.user = payload;

        // 4. Если на маршруте есть @Roles — проверяем роль
        const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, targets);
        if (roles && !roles.includes(payload.role)) {
            throw new ForbiddenException();
        }

        return true;
    }
}