import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IFreightsRepository,
  CreateFreightData,
  UpdateFreightData,
  FreightsFilters,
  ClientSummary,
  AdminFreightsFilters,
  AdminFreightRow,
} from './freights.repository.interface.js';
import { Freight, FreightStatus } from '../entities/freight.entity.js';
import { FreightMapper } from '../mappers/freight.mapper.js';
import {
  PaginationOptions,
  PaginatedResult,
  buildPrismaPagination,
  buildWhereClause,
  FilterMode,
} from '../../common/pagination/index.js';
import { FreightOrderBy } from '../dto/freights-filter.dto.js';
import type { Prisma } from '../../../generated/prisma/client.js';

const includeFreightRelations = {
  originCity: true,
  destinationCity: true,
  photos: {
    take: 1,
    orderBy: { order: 'asc' },
  },
} as const;

function getOrderBy(
  filters: FreightsFilters,
): Prisma.FreightOrderByWithRelationInput {
  return {
    createdAt: filters.orderBy === FreightOrderBy.OLDEST ? 'asc' : 'desc',
  };
}

@Injectable()
export class FreightsRepository implements IFreightsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFreightData): Promise<Freight> {
    const prismaFreight = await this.prisma.freight.create({
      data: {
        clientId: data.clientId,
        title: data.title,
        description: data.description,
        vehicleCategory: data.vehicleCategory,
        originCityId: data.originCityId,
        originDistrict: data.originDistrict,
        originStreet: data.originStreet,
        originNumber: data.originNumber,
        destinationCityId: data.destinationCityId,
        destinationDistrict: data.destinationDistrict,
        destinationStreet: data.destinationStreet,
        destinationNumber: data.destinationNumber,
        dateMode: data.dateMode,
        exactDatetime: data.exactDatetime ?? null,
        availabilityWindow: data.availabilityWindow ?? null,
        suggestedPrice: data.suggestedPrice ?? null,
      },
      include: includeFreightRelations,
    });

    return FreightMapper.toDomain(prismaFreight);
  }

  async findAllByClient(
    clientId: string,
    filters: FreightsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Freight>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = {
      clientId,
      ...buildWhereClause([
        { field: 'status', mode: FilterMode.EQUALS, value: filters.status },
        {
          field: 'vehicleCategory',
          mode: FilterMode.EQUALS,
          value: filters.vehicleCategory,
        },
      ]),
    };

    const [total, prismaFreights] = await Promise.all([
      this.prisma.freight.count({ where }),
      this.prisma.freight.findMany({
        where,
        skip,
        take,
        include: includeFreightRelations,
        orderBy: getOrderBy(filters),
      }),
    ]);

    return {
      data: FreightMapper.toDomainList(prismaFreights),
      total,
    };
  }

  async findAllOpen(
    filters: FreightsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Freight>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = {
      status: FreightStatus.OPEN,
      ...(filters.vehicleCategories
        ? { vehicleCategory: { in: filters.vehicleCategories } }
        : buildWhereClause([
            {
              field: 'vehicleCategory',
              mode: FilterMode.EQUALS,
              value: filters.vehicleCategory,
            },
          ])),
      ...(filters.cityId ? { originCityId: filters.cityId } : {}),
    };

    const [total, prismaFreights] = await Promise.all([
      this.prisma.freight.count({ where }),
      this.prisma.freight.findMany({
        where,
        skip,
        take,
        include: includeFreightRelations,
        orderBy: getOrderBy(filters),
      }),
    ]);

    return {
      data: FreightMapper.toDomainList(prismaFreights),
      total,
    };
  }

  async findById(id: string): Promise<Freight | null> {
    const prismaFreight = await this.prisma.freight.findUnique({
      where: { id },
      include: includeFreightRelations,
    });

    if (!prismaFreight) return null;
    return FreightMapper.toDomain(prismaFreight);
  }

  async findOpenById(id: string): Promise<Freight | null> {
    const prismaFreight = await this.prisma.freight.findFirst({
      where: { id, status: FreightStatus.OPEN },
      include: includeFreightRelations,
    });

    if (!prismaFreight) return null;
    return FreightMapper.toDomain(prismaFreight);
  }

  async findByIdAndClient(
    id: string,
    clientId: string,
  ): Promise<Freight | null> {
    const prismaFreight = await this.prisma.freight.findFirst({
      where: { id, clientId },
      include: includeFreightRelations,
    });

    if (!prismaFreight) return null;
    return FreightMapper.toDomain(prismaFreight);
  }

  async update(id: string, data: UpdateFreightData): Promise<Freight> {
    const prismaFreight = await this.prisma.freight.update({
      where: { id },
      data,
      include: includeFreightRelations,
    });

    return FreightMapper.toDomain(prismaFreight);
  }

  async updateStatus(id: string, status: FreightStatus): Promise<Freight> {
    const prismaFreight = await this.prisma.freight.update({
      where: { id },
      data: { status },
      include: includeFreightRelations,
    });

    return FreightMapper.toDomain(prismaFreight);
  }

  async cancelWithPendingApplications(id: string): Promise<Freight | null> {
    return this.prisma.$transaction(async (tx) => {
      // Atualização condicional: só cancela se o frete ainda puder ser cancelado
      const updated = await tx.freight.updateMany({
        where: { id, status: { in: ['OPEN', 'NEGOTIATING'] } },
        data: { status: 'CANCELLED' },
      });
      if (updated.count !== 1) {
        return null;
      }
      // Propostas ainda pendentes deixam de valer quando o frete é cancelado
      await tx.application.updateMany({
        where: { freightId: id, status: 'PENDING' },
        data: { status: 'REJECTED' },
      });
      const prismaFreight = await tx.freight.findUniqueOrThrow({
        where: { id },
        include: includeFreightRelations,
      });
      return FreightMapper.toDomain(prismaFreight);
    });
  }

  async getClientSummary(clientId: string): Promise<ClientSummary | null> {
    const [user, reviews, completedFreights] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: clientId },
        select: { name: true, phoneNumber: true },
      }),
      this.prisma.review.aggregate({
        where: { reviewedId: clientId },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      this.prisma.freight.count({
        where: { clientId, status: 'COMPLETED' },
      }),
    ]);

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      averageRating: reviews._avg.rating ?? 0,
      totalReviews: reviews._count.rating,
      completedFreights,
      phoneNumber: user.phoneNumber,
    };
  }

  async findAllForAdmin(
    filters: AdminFreightsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<AdminFreightRow>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = {
      ...buildWhereClause([
        { field: 'status', mode: FilterMode.EQUALS, value: filters.status },
        {
          field: 'vehicleCategory',
          mode: FilterMode.EQUALS,
          value: filters.vehicleCategory,
        },
      ]),
      ...(filters.search
        ? { title: { contains: filters.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [total, prismaFreights] = await Promise.all([
      this.prisma.freight.count({ where }),
      this.prisma.freight.findMany({
        where,
        skip,
        take,
        include: {
          ...includeFreightRelations,
          client: { select: { name: true } },
          _count: { select: { applications: true } },
        },
        orderBy: getOrderBy(filters),
      }),
    ]);

    return {
      data: prismaFreights.map((prismaFreight) => ({
        freight: FreightMapper.toDomain(prismaFreight),
        clientName: prismaFreight.client.name,
        applicationsCount: prismaFreight._count.applications,
      })),
      total,
    };
  }

  async findActiveVehicleCategoryNames(userId: string): Promise<string[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { userId, active: true },
      select: { vehicleCategory: { select: { name: true } } },
    });

    return [...new Set(vehicles.map((v) => v.vehicleCategory.name))];
  }
}
