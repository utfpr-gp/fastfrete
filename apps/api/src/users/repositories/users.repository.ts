import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IUsersRepository,
  CreateUserData,
  UpdateUserData,
  UsersFilters,
  PublicProfileData,
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

    const city = await this.prisma.city.findUnique({
      where: { id: data.cityId },
      select: { id: true },
    });

    if (!city) {
      throw new BadRequestException(`City with id ${data.cityId} not found`);
    }

    // Create user with role assignment
    const prismaUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        cityId: data.cityId,
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

  async getPublicProfile(id: string): Promise<PublicProfileData | null> {
    const user = await this.prisma.user.findFirst({
      where: { id, status: 'ACTIVE' },
      include: {
        city: { select: { name: true } },
        userRoles: { include: { role: { include: { roleType: true } } } },
        vehicles: {
          where: { active: true },
          include: { vehicleCategory: { select: { name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user) {
      return null;
    }

    const roleTypes = user.userRoles.map((ur) => ur.role.roleType.name);
    const roleType = roleTypes.includes(RoleTypeEnum.CARRIER)
      ? RoleTypeEnum.CARRIER
      : roleTypes.includes(RoleTypeEnum.CUSTOMER)
        ? RoleTypeEnum.CUSTOMER
        : null;

    if (!roleType) {
      return null;
    }

    const [reviews, completedFreights] = await Promise.all([
      this.prisma.review.aggregate({
        where: { reviewedId: id },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      roleType === RoleTypeEnum.CARRIER
        ? this.prisma.application.count({
            where: { freighterId: id, status: 'COMPLETED' },
          })
        : this.prisma.freight.count({
            where: { clientId: id, status: 'COMPLETED' },
          }),
    ]);

    return {
      id: user.id,
      name: user.name,
      roleType,
      cityName: user.city.name,
      memberSince: user.createdAt,
      averageRating: reviews._avg.rating ?? 0,
      totalReviews: reviews._count.rating,
      completedFreights,
      vehicles:
        roleType === RoleTypeEnum.CARRIER
          ? user.vehicles.map((v) => ({
              id: v.id,
              vehicleCategoryName: v.vehicleCategory.name,
              model: v.model,
              capacityKg: Number(v.capacityKg),
            }))
          : [],
    };
  }
}
