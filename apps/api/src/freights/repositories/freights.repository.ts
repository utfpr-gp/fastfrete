import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IFreightsRepository,
  CreateFreightData,
  UpdateFreightData,
  FreightsFilters,
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

function getOrderBy(filters: FreightsFilters): Prisma.FreightOrderByWithRelationInput {
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
        { field: 'vehicleCategory', mode: FilterMode.EQUALS, value: filters.vehicleCategory },
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
      ...buildWhereClause([
        { field: 'vehicleCategory', mode: FilterMode.EQUALS, value: filters.vehicleCategory },
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

  async findByIdAndClient(id: string, clientId: string): Promise<Freight | null> {
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
}
