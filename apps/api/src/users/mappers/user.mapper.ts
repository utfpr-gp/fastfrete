import {
  User as PrismaUser,
  UserStatus as PrismaUserStatus,
} from '../../../generated/prisma/client';
import { User, UserRole, UserStatus } from '../entities/user.entity.js';
import {
  UserResponseDto,
  UserRoleResponseDto,
} from '../dto/user-response.dto.js';

// Type for Prisma User with included relations
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
  private static mapStatus(prismaStatus: PrismaUserStatus): UserStatus {
    return UserStatus[prismaStatus];
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

  static toDomainList(prismaUsers: PrismaUserWithRoles[]): User[] {
    return prismaUsers.map((user) => this.toDomain(user));
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

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
