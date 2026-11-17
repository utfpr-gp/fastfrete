import { ConflictException, Injectable } from '@nestjs/common';
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
        message: data.message,
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
      include: {
        vehicle: {
          include: {
            vehicleCategory: true,
          },
        },
      },
    });

    if (!prismaApplication) return null;
    return ApplicationMapper.toDomain(prismaApplication);
  }

  async findByFreight(freightId: string): Promise<Application[]> {
    const prismaApplications = await this.prisma.application.findMany({
      where: { freightId },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          include: {
            vehicleCategory: true,
          },
        },
      },
    });

    return ApplicationMapper.toDomainList(prismaApplications);
  }

  async findByFreightAndFreighter(
    freightId: string,
    freighterId: string,
  ): Promise<Application | null> {
    const prismaApplication = await this.prisma.application.findUnique({
      where: { freightId_freighterId: { freightId, freighterId } },
      include: {
        vehicle: {
          include: {
            vehicleCategory: true,
          },
        },
      },
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
        include: {
          vehicle: {
            include: {
              vehicleCategory: true,
            },
          },
        },
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

  async updateStatus(
    id: string,
    status: ApplicationStatus,
    expectedStatus?: ApplicationStatus,
  ): Promise<Application> {
    if (expectedStatus) {
      // Transição condicional: só muda se a proposta ainda estiver no status esperado
      const updated = await this.prisma.application.updateMany({
        where: { id, status: expectedStatus },
        data: { status },
      });
      if (updated.count !== 1) {
        throw new ConflictException('A proposta mudou de status antes desta ação');
      }
    } else {
      await this.prisma.application.update({ where: { id }, data: { status } });
    }
    const prismaApplication = await this.prisma.application.findUniqueOrThrow({
      where: { id },
      include: { vehicle: { include: { vehicleCategory: true } } },
    });
    return ApplicationMapper.toDomain(prismaApplication);
  }


  async acceptApplication(applicationId: string): Promise<Application> {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.findUniqueOrThrow({
        where: { id: applicationId },
      });

      // Atualizações condicionais: o PostgreSQL bloqueia a linha e reavalia o
      // WHERE, então só uma de duas requisições concorrentes consegue passar.
      const freightUpdate = await tx.freight.updateMany({
        where: { id: application.freightId, status: FreightStatus.OPEN },
        data: {
          status: FreightStatus.IN_PROGRESS,
          selectedApplicationId: applicationId,
        },
      });
      if (freightUpdate.count !== 1) {
        throw new ConflictException('O frete não está mais aberto a propostas');
      }

      const applicationUpdate = await tx.application.updateMany({
        where: { id: applicationId, status: ApplicationStatus.PENDING },
        data: { status: ApplicationStatus.ACCEPTED },
      });
      if (applicationUpdate.count !== 1) {
        throw new ConflictException('A proposta não está mais pendente');
      }

      // Recusa as demais propostas ainda pendentes do mesmo frete
      await tx.application.updateMany({
        where: {
          freightId: application.freightId,
          id: { not: applicationId },
          status: ApplicationStatus.PENDING,
        },
        data: { status: ApplicationStatus.REJECTED },
      });

      const accepted = await tx.application.findUniqueOrThrow({
        where: { id: applicationId },
        include: { vehicle: { include: { vehicleCategory: true } } },
      });
      return ApplicationMapper.toDomain(accepted);
    });
  }

  async completeApplication(applicationId: string): Promise<Application> {
    return this.prisma.$transaction(async (tx) => {
      const application = await tx.application.findUniqueOrThrow({
        where: { id: applicationId },
      });

      // Mesma estratégia do aceite: cada linha só muda se ainda estiver no estado esperado
      const applicationUpdate = await tx.application.updateMany({
        where: { id: applicationId, status: ApplicationStatus.ACCEPTED },
        data: { status: ApplicationStatus.COMPLETED },
      });
      const freightUpdate = await tx.freight.updateMany({
        where: { id: application.freightId, status: FreightStatus.IN_PROGRESS },
        data: { status: FreightStatus.COMPLETED },
      });
      if (applicationUpdate.count !== 1 || freightUpdate.count !== 1) {
        throw new ConflictException('O frete ou a proposta mudaram de status antes da conclusão');
      }

      const completed = await tx.application.findUniqueOrThrow({
        where: { id: applicationId },
        include: { vehicle: { include: { vehicleCategory: true } } },
      });
      return ApplicationMapper.toDomain(completed);
    });
  }

  async validateVehicleOwnership(
    vehicleId: string,
    freighterId: string,
  ): Promise<boolean> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId: freighterId,
        active: true,
      },
    });

    return vehicle !== null;
  }
}
