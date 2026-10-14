import {
  Vehicle as PrismaVehicle,
  VehicleCategory as PrismaVehicleCategory,
} from '../../../generated/prisma/client.js';
import { Vehicle } from '../entities/vehicle.entity.js';
import { VehicleResponseDto } from '../dto/vehicle-response.dto.js';

interface PrismaVehicleWithCategory extends PrismaVehicle {
  vehicleCategory: PrismaVehicleCategory;
}

export class VehicleMapper {
  static toDomain(prismaVehicle: PrismaVehicleWithCategory): Vehicle {
    return new Vehicle({
      id: prismaVehicle.id,
      userId: prismaVehicle.userId,
      vehicleCategoryId: prismaVehicle.vehicleCategoryId,
      vehicleCategoryName: prismaVehicle.vehicleCategory.name,
      model: prismaVehicle.model,
      plate: prismaVehicle.plate,
      capacityKg: prismaVehicle.capacityKg.toString(),
      color: prismaVehicle.color,
      active: prismaVehicle.active,
      createdAt: prismaVehicle.createdAt,
      updatedAt: prismaVehicle.updatedAt,
    });
  }

  static toDomainList(prismaVehicles: PrismaVehicleWithCategory[]): Vehicle[] {
    return prismaVehicles.map((v) => this.toDomain(v));
  }

  static toResponse(vehicle: Vehicle): VehicleResponseDto {
    return {
      id: vehicle.id,
      userId: vehicle.userId,
      vehicleCategoryId: vehicle.vehicleCategoryId,
      vehicleCategoryName: vehicle.vehicleCategoryName,
      model: vehicle.model,
      plate: vehicle.plate,
      capacityKg: vehicle.capacityKg,
      color: vehicle.color,
      active: vehicle.active,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    };
  }

  static toResponseList(vehicles: Vehicle[]): VehicleResponseDto[] {
    return vehicles.map((v) => this.toResponse(v));
  }
}
