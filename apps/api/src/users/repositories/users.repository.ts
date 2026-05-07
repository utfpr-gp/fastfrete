import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IUsersRepository,
  CreateUserData,
  UpdateUserData,
  UsersFilters,
} from './users.repository.interface.js';
import { User } from '../entities/user.entity.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import {
  PaginationOptions,
  PaginatedResult,
  buildPrismaPagination,
  buildWhereClause,
  FilterMode,
} from '../../common/pagination/index.js';

// Include clause for user relations
const includeUserRelations = {
  city: true,
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
};

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData, roleType: RoleTypeEnum): Promise<User> {
    // Find the role for the selected roleType
    const role = await this.prisma.role.findFirst({
      where: {
        roleType: {
          name: roleType,
        },
      },
    });

    if (!role) {
      throw new BadRequestException(`Role for type ${roleType} not found`);
    }

    const cityId =
      data.cityId ??
      (
        await this.prisma.city.findFirstOrThrow({
          where: { name: 'Guarapuava', state: 'Paraná' },
        })
      ).id;

    // Create user with role assignment
    const prismaUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        cityId,
        userRoles: {
          create: {
            roleId: role.id,
          },
        },
      },
      include: includeUserRelations,
    });

    return UserMapper.toDomain(prismaUser);
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      include: includeUserRelations,
    });

    return UserMapper.toDomainList(prismaUsers);
  }

  async findAllPaginated(
    filters: UsersFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<User>> {
    const { skip, take } = buildPrismaPagination(pagination);

    // Build where clause based on filters
    const where = buildWhereClause([
      { field: 'name', mode: FilterMode.CONTAINS, value: filters.name },
      { field: 'email', mode: FilterMode.EQUALS, value: filters.email },
      { field: 'status', mode: FilterMode.EQUALS, value: filters.status },
    ]);

    // Execute count and findMany in parallel for better performance
    const [total, prismaUsers] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take,
        include: includeUserRelations,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: UserMapper.toDomainList(prismaUsers),
      total,
    };
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
      include: includeUserRelations,
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
      include: includeUserRelations,
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: { id },
      data,
      include: includeUserRelations,
    });

    return UserMapper.toDomain(prismaUser);
  }

  async delete(id: string): Promise<User> {
    const prismaUser = await this.prisma.user.delete({
      where: { id },
      include: includeUserRelations,
    });

    return UserMapper.toDomain(prismaUser);
  }
}
