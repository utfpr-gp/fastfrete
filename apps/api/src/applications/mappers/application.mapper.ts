import {
  Application as PrismaApplication,
  ApplicationStatus as PrismaApplicationStatus,
  Vehicle as PrismaVehicle,
  VehicleCategory as PrismaVehicleCategory,
} from '../../../generated/prisma/client.js';
import {
  Application,
  ApplicationStatus,
  ApplicationVehicle,
} from '../entities/application.entity.js';
import { ApplicationResponseDto } from '../dto/application-response.dto.js';

interface PrismaApplicationWithVehicle extends PrismaApplication {
  vehicle?:
    | (PrismaVehicle & {
        vehicleCategory: PrismaVehicleCategory;
      })
    | null;
}

export class ApplicationMapper {
  private static mapStatus(s: PrismaApplicationStatus): ApplicationStatus {
    return ApplicationStatus[s];
  }

  private static mapVehicle(
    prismaApplication: PrismaApplicationWithVehicle,
  ): ApplicationVehicle | null {
    if (!prismaApplication.vehicle) return null;

    const v = prismaApplication.vehicle;
    return {
      id: v.id,
      model: v.model,
      plate: v.plate,
      capacityKg: v.capacityKg.toString(),
      color: v.color,
      vehicleCategoryName: v.vehicleCategory.name,
    };
  }

  static toDomain(
    prismaApplication: PrismaApplicationWithVehicle,
  ): Application {
    return new Application({
      id: prismaApplication.id,
      freightId: prismaApplication.freightId,
      freighterId: prismaApplication.freighterId,
      vehicleId: prismaApplication.vehicleId,
      vehicle: this.mapVehicle(prismaApplication),
      proposedPrice: prismaApplication.proposedPrice.toString(),
      message: prismaApplication.message,
      status: this.mapStatus(prismaApplication.status),
      createdAt: prismaApplication.createdAt,
      updatedAt: prismaApplication.updatedAt,
    });
  }

  static toDomainList(prismaApplications: PrismaApplication[]): Application[] {
    return prismaApplications.map((a) => this.toDomain(a));
  }

  static toResponse(application: Application): ApplicationResponseDto {
    return {
      id: application.id,
      freightId: application.freightId,
      freighterId: application.freighterId,
      vehicleId: application.vehicleId,
      vehicle: application.vehicle,
      proposedPrice: application.proposedPrice,
      message: application.message,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  static toResponseList(applications: Application[]): ApplicationResponseDto[] {
    return applications.map((a) => this.toResponse(a));
  }
}
