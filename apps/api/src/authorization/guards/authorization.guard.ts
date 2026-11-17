import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLE_TYPES_KEY } from '../decorators/role-types.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { CurrentUserData } from '../decorators/current-user.decorator';
import { RoleTypeEnum } from '../definitions/role-types.definition';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredRoleTypes = this.reflector.getAllAndOverride<RoleTypeEnum[]>(
      ROLE_TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoleTypes?.length && !requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as CurrentUserData | undefined;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Quando a rota declara as duas exigências, o usuário precisa atender a ambas:
    // ter um dos tipos de papel e uma das permissões.
    const hasRoleType =
      !requiredRoleTypes?.length ||
      requiredRoleTypes.some((roleType) => user.roleTypes.includes(roleType));
    const hasPermission =
      !requiredPermissions?.length ||
      requiredPermissions.some((permission) =>
        user.permissions.includes(permission),
      );

    if (hasRoleType && hasPermission) {
      return true;
    }

    throw new ForbiddenException('Insufficient permissions');
  }
}
