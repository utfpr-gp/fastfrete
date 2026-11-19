import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CurrentUserData } from './decorators/current-user.decorator';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserAuthorizationData(
    userId: string,
  ): Promise<CurrentUserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                roleType: true,
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException(
        'Conta suspensa. Entre em contato com o suporte.',
      );
    }

    const roleTypes = [
      ...new Set(user.userRoles.map((ur) => ur.role.roleType.name)),
    ];

    const permissions = [
      ...new Set(
        user.userRoles.flatMap((ur) =>
          ur.role.rolePermissions.map((rp) => rp.permission.name),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      roleTypes,
      permissions,
    };
  }

  hasRoleType(user: CurrentUserData, roleTypes: string[]): boolean {
    return roleTypes.some((roleType) => user.roleTypes.includes(roleType));
  }

  hasPermission(user: CurrentUserData, permissions: string[]): boolean {
    return permissions.some((permission) =>
      user.permissions.includes(permission),
    );
  }
}
