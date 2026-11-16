import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  ICarriersRepository,
  CarriersFilters,
} from './carriers.repository.interface.js';
import { Carrier } from '../entities/carrier.entity.js';
import { CarrierMapper } from '../mappers/carrier.mapper.js';
import {
  PaginationOptions,
  PaginatedResult,
  buildPrismaPagination,
} from '../../common/pagination/index.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';

const includeCarrierRelations = {
  city: { select: { name: true } },
  vehicles: {
    where: { active: true },
    include: {
      vehicleCategory: { select: { name: true } },
    },
  },
  reviewsByReviewed: {
    select: { rating: true },
  },
};

@Injectable()
export class CarriersRepository implements ICarriersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCarriersWithVehicles(
    filters: CarriersFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Carrier>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const carriersWhere = {
      userRoles: {
        some: {
          role: {
            roleType: {
              name: RoleTypeEnum.CARRIER,
            },
          },
        },
      },
      vehicles: filters.vehicleCategory
        ? { some: { vehicleCategory: { name: filters.vehicleCategory }, active: true } }
        : { some: { active: true } },
    };

    const [total, prismaCarriers] = await Promise.all([
      this.prisma.user.count({ where: carriersWhere }),
      this.prisma.user.findMany({
        where: carriersWhere,
        skip,
        take,
        include: includeCarrierRelations,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: CarrierMapper.toDomainList(prismaCarriers as any),
      total,
    };
  }
}
