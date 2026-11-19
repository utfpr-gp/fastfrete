import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Prisma } from '../../../generated/prisma/client.js';
import {
  IVehiclesRepository,
  CreateVehicleData,
  UpdateVehicleData,
  VehiclesFilters,
  VehicleCategoryData,
} from './vehicles.repository.interface.js';
import { Vehicle } from '../entities/vehicle.entity.js';
import { VehicleMapper } from '../mappers/vehicle.mapper.js';
import {
  PaginationOptions,
  PaginatedResult,
  buildPrismaPagination,
  buildWhereClause,
  FilterMode,
} from '../../common/pagination/index.js';

const includeVehicleRelations = {
  vehicleCategory: true,
} as const;

@Injectable()
export class VehiclesRepository implements IVehiclesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVehicleData): Promise<Vehicle> {
    const prismaVehicle = await this.prisma.vehicle.create({
      data: {
        userId: data.userId,
        vehicleCategoryId: data.vehicleCategoryId,
        model: data.model,
        plate: data.plate ?? null,
        capacityKg: new Prisma.Decimal(data.capacityKg),
        color: data.color ?? null,
      },
      include: includeVehicleRelations,
    });

    return VehicleMapper.toDomain(prismaVehicle);
  }

  async findAllByUser(
    userId: string,
    filters: VehiclesFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Vehicle>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = {
      userId,
      ...buildWhereClause([
        {
          field: 'vehicleCategoryId',
          mode: FilterMode.EQUALS,
          value: filters.vehicleCategoryId,
        },
        { field: 'active', mode: FilterMode.EQUALS, value: filters.active },
      ]),
    };

    const [total, prismaVehicles] = await Promise.all([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({
        where,
        skip,
        take,
        include: includeVehicleRelations,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: VehicleMapper.toDomainList(prismaVehicles),
      total,
    };
  }

  async findById(id: string): Promise<Vehicle | null> {
    const prismaVehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: includeVehicleRelations,
    });

    if (!prismaVehicle) return null;
    return VehicleMapper.toDomain(prismaVehicle);
  }

  async findByIdAndUser(id: string, userId: string): Promise<Vehicle | null> {
    const prismaVehicle = await this.prisma.vehicle.findFirst({
      where: { id, userId },
      include: includeVehicleRelations,
    });

    if (!prismaVehicle) return null;
    return VehicleMapper.toDomain(prismaVehicle);
  }

  async update(id: string, data: UpdateVehicleData): Promise<Vehicle> {
    const prismaVehicle = await this.prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        capacityKg: data.capacityKg
          ? new Prisma.Decimal(data.capacityKg)
          : undefined,
      },
      include: includeVehicleRelations,
    });

    return VehicleMapper.toDomain(prismaVehicle);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({
      where: { id },
    });
  }

  async findByFreighter(
    freighterId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Vehicle>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = {
      userId: freighterId,
      active: true,
    };

    const [total, prismaVehicles] = await Promise.all([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({
        where,
        skip,
        take,
        include: includeVehicleRelations,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: VehicleMapper.toDomainList(prismaVehicles),
      total,
    };
  }

  async findAllCategories(): Promise<VehicleCategoryData[]> {
    return this.prisma.vehicleCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
