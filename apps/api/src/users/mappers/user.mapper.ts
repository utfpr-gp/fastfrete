import type { User as PrismaUser } from '../../../generated/prisma/client';
import * as PrismaEnums from '../../../generated/prisma/enums';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UserResponseDto, UserRoleResponseDto } from '../dto/user-response.dto';

interface PrismaUserWithRoles extends PrismaUser {
  userRoles?: {
    role: {
      name: string;
      roleType: {
        name: string;
      };
      rolePermissions: {
        permission: {
          name: string;
        };
      }[];
    };
  }[];
}

export class UserMapper {
  private static mapStatus(prismaStatus: PrismaEnums.UserStatus): UserStatus {
    return UserStatus[prismaStatus as keyof typeof UserStatus];
  }

  static toDomain(prismaUser: PrismaUserWithRoles): User {
    const roles: UserRole[] = (prismaUser.userRoles ?? []).map((userRole) => ({
      name: userRole.role.name,
      roleType: userRole.role.roleType.name,
      permissions: userRole.role.rolePermissions.map(
        (rp) => rp.permission.name,
      ),
    }));

    return new User({
      id: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      phoneNumber: prismaUser.phoneNumber,
      status: this.mapStatus(prismaUser.status),
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      roles,
    });
  }

  static toResponse(user: User): UserResponseDto {
    const roles: UserRoleResponseDto[] = user.roles.map((role) => ({
      name: role.name,
      roleType: role.roleType,
      permissions: role.permissions,
    }));

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles,
    };
  }
}
