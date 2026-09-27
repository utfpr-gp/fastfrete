import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IApplicationsRepository,
  CreateApplicationData,
  UpdateApplicationData,
  ApplicationsFilters,
} from './applications.repository.interface.js';
import {
  Application,
  ApplicationStatus,
} from '../entities/application.entity.js';
import { ApplicationMapper } from '../mappers/application.mapper.js';
import { FreightStatus } from '../../freights/entities/freight.entity.js';
import {
  PaginationOptions,
  PaginatedResult,
  buildPrismaPagination,
  buildWhereClause,
  FilterMode,
} from '../../common/pagination/index.js';

@Injectable()
export class ApplicationsRepository implements IApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateApplicationData): Promise<Application> {
    const prismaApplication = await this.prisma.application.create({
      data: {
        freightId: data.freightId,
        freighterId: data.freighterId,
        vehicleId: data.vehicleId,
        proposedPrice: data.proposedPrice,
      },
      include: {
        vehicle: {
          include: {
            vehicleCategory: true,
          },
        },
      },
    });

    return ApplicationMapper.toDomain(prismaApplication);
  }

  async findById(id: string): Promise<Application | null> {
    const prismaApplication = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!prismaApplication) return null;
    return ApplicationMapper.toDomain(prismaApplication);
  }

  async findByFreight(freightId: string): Promise<Application[]> {
    const prismaApplications = await this.prisma.application.findMany({
      where: { freightId },
      orderBy: { createdAt: 'desc' },
    });

    return ApplicationMapper.toDomainList(prismaApplications);
  }

  async findByFreightAndFreighter(
    freightId: string,
    freighterId: string,
  ): Promise<Application | null> {
    const prismaApplication = await this.prisma.application.findUnique({
      where: { freightId_freighterId: { freightId, freighterId } },
    });

    if (!prismaApplication) return null;
    return ApplicationMapper.toDomain(prismaApplication);
  }

  async findByFreighter(
    freighterId: string,
    filters: ApplicationsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Application>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = {
      freighterId,
      ...buildWhereClause([
        { field: 'status', mode: FilterMode.EQUALS, value: filters.status },
        {
          field: 'freightId',
          mode: FilterMode.EQUALS,
          value: filters.freightId,
        },
      ]),
    };

    const [total, prismaApplications] = await Promise.all([
      this.prisma.application.count({ where }),
      this.prisma.application.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: ApplicationMapper.toDomainList(prismaApplications),
      total,
    };
  }

  async update(id: string, data: UpdateApplicationData): Promise<Application> {
    const prismaApplication = await this.prisma.application.update({
      where: { id },
      data,
    });

    return ApplicationMapper.toDomain(prismaApplication);
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    const prismaApplication = await this.prisma.application.update({
      where: { id },
      data: { status },
    });

    return ApplicationMapper.toDomain(prismaApplication);
  }

  async acceptApplication(applicationId: string): Promise<Application> {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.findUniqueOrThrow({
        where: { id: applicationId },
      });

      const accepted = await tx.application.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.ACCEPTED },
      });

      await tx.application.updateMany({
        where: {
          freightId: application.freightId,
          id: { not: applicationId },
        },
        data: { status: ApplicationStatus.REJECTED },
      });

      await tx.freight.update({
        where: { id: application.freightId },
        data: {
          status: FreightStatus.IN_PROGRESS,
          selectedApplicationId: applicationId,
        },
      });

      return ApplicationMapper.toDomain(accepted);
    });
  }

  async completeApplication(applicationId: string): Promise<Application> {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.findUniqueOrThrow({
        where: { id: applicationId },
      });

      const completed = await tx.application.update({
        where: { id: applicationId },
        data: { status: ApplicationStatus.COMPLETED },
      });

      await tx.freight.update({
        where: { id: application.freightId },
        data: { status: FreightStatus.COMPLETED },
      });

      return ApplicationMapper.toDomain(completed);
    });
  }
}
