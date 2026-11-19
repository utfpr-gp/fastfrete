import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IAdminDashboardRepository,
  RawPlatformMetrics,
} from './admin-dashboard.repository.interface.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';

function countUsersByRoleType(roleType: RoleTypeEnum) {
  return {
    userRoles: { some: { role: { roleType: { name: roleType } } } },
  };
}

function toCountMap(
  groups: { status: string; _count: { _all: number } }[],
): Record<string, number> {
  return Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
}

@Injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformMetrics(): Promise<RawPlatformMetrics> {
    const [
      customers,
      carriers,
      suspendedUsers,
      freightGroups,
      applicationGroups,
      reviews,
    ] = await Promise.all([
      this.prisma.user.count({
        where: countUsersByRoleType(RoleTypeEnum.CUSTOMER),
      }),
      this.prisma.user.count({
        where: countUsersByRoleType(RoleTypeEnum.CARRIER),
      }),
      this.prisma.user.count({ where: { status: 'SUSPENDED' } }),
      this.prisma.freight.groupBy({ by: ['status'], _count: { _all: true } }),
      this.prisma.application.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
      }),
    ]);

    return {
      customers,
      carriers,
      suspendedUsers,
      freightsByStatus: toCountMap(freightGroups),
      applicationsByStatus: toCountMap(applicationGroups),
      reviewsCount: reviews._count.rating,
      averageRating: reviews._avg.rating,
    };
  }
}
