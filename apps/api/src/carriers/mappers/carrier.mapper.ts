import {
  Carrier,
  type CarrierVehicle,
  type CarrierReviewStats,
} from '../entities/carrier.entity.js';
import { CarrierResponseDto } from '../dto/carrier-response.dto.js';

type PrismaCarrierWithRelations = {
  id: string;
  name: string;
  phoneNumber: string;
  city: { name: string };
  vehicles: {
    id: string;
    vehicleCategoryId: string;
    vehicleCategory: { name: string };
    model: string;
    plate: string | null;
    capacityKg: number;
    active: boolean;
  }[];
  reviewsByReviewed: { rating: number }[];
};

export class CarrierMapper {
  static toDomain(prismaCarrier: PrismaCarrierWithRelations): Carrier {
    const vehicles: CarrierVehicle[] = prismaCarrier.vehicles.map((v) => ({
      id: v.id,
      vehicleCategoryId: v.vehicleCategoryId,
      vehicleCategoryName: v.vehicleCategory.name,
      model: v.model,
      plate: v.plate || '',
      capacityKg: Number(v.capacityKg),
      isActive: v.active,
    }));

    const reviewStats: CarrierReviewStats = {
      averageRating:
        prismaCarrier.reviewsByReviewed.length > 0
          ? prismaCarrier.reviewsByReviewed.reduce(
              (sum, r) => sum + r.rating,
              0,
            ) / prismaCarrier.reviewsByReviewed.length
          : 0,
      totalReviews: prismaCarrier.reviewsByReviewed.length,
    };

    return new Carrier({
      id: prismaCarrier.id,
      name: prismaCarrier.name,
      phoneNumber: prismaCarrier.phoneNumber,
      cityName: prismaCarrier.city.name,
      vehicles,
      reviewStats,
    });
  }

  static toDomainList(prismaCarriers: PrismaCarrierWithRelations[]): Carrier[] {
    return prismaCarriers.map((c) => CarrierMapper.toDomain(c));
  }

  static toResponse(carrier: Carrier): CarrierResponseDto {
    return {
      id: carrier.id,
      name: carrier.name,
      phoneNumber: carrier.phoneNumber,
      cityName: carrier.cityName,
      vehicles: carrier.vehicles.map((v) => ({
        id: v.id,
        vehicleCategoryId: v.vehicleCategoryId,
        vehicleCategoryName: v.vehicleCategoryName,
        model: v.model,
        plate: v.plate,
        capacityKg: v.capacityKg,
        isActive: v.isActive,
      })),
      reviewStats: {
        averageRating: carrier.reviewStats.averageRating,
        totalReviews: carrier.reviewStats.totalReviews,
      },
    };
  }

  static toResponseList(carriers: Carrier[]): CarrierResponseDto[] {
    return carriers.map((c) => CarrierMapper.toResponse(c));
  }
}
