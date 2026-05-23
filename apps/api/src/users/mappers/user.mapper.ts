import {
  User as PrismaUser,
  UserStatus as PrismaUserStatus,
} from '../../../generated/prisma/client';
import { User, UserRole, UserStatus } from '../entities/user.entity.js';
import { UserResponseDto, UserRoleResponseDto } from '../dto/user-response.dto.js';

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
  city?: {
    id: string;
    name: string;
    state: string;
  };
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

    if (!prismaUser.city) {
      throw new Error(
        `User ${prismaUser.id} has no city relation loaded — include city in the query`,
      );
    }

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
      city: {
        id: prismaUser.city.id,
        name: prismaUser.city.name,
        state: prismaUser.city.state,
      },
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
      city: {
        id: user.city.id,
        name: user.city.name,
        state: user.city.state,
      },
    };
  }

  static toResponseList(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
