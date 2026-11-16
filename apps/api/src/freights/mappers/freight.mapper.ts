import {
  Freight as PrismaFreight,
  City as PrismaCity,
  FreightStatus as PrismaFreightStatus,
  FreightDateMode as PrismaFreightDateMode,
  FreightPhoto as PrismaFreightPhoto,
} from '../../../generated/prisma/client';
import {
  Freight,
  FreightStatus,
  FreightDateMode,
} from '../entities/freight.entity.js';
import { FreightResponseDto } from '../dto/freight-response.dto.js';

interface PrismaFreightWithCities extends PrismaFreight {
  originCity: PrismaCity;
  destinationCity: PrismaCity;
  photos?: PrismaFreightPhoto[];
}

export class FreightMapper {
  private static mapStatus(s: PrismaFreightStatus): FreightStatus {
    return FreightStatus[s];
  }

  private static mapDateMode(m: PrismaFreightDateMode): FreightDateMode {
    return FreightDateMode[m];
  }

  static toDomain(prismaFreight: PrismaFreightWithCities): Freight {
    const coverPhoto = prismaFreight.photos?.[0]?.url ?? null;

    return new Freight({
      id: prismaFreight.id,
      clientId: prismaFreight.clientId,
      title: prismaFreight.title,
      description: prismaFreight.description,
      vehicleCategory: prismaFreight.vehicleCategory,
      originCityId: prismaFreight.originCityId,
      originDistrict: prismaFreight.originDistrict,
      originStreet: prismaFreight.originStreet,
      originNumber: prismaFreight.originNumber,
      destinationCityId: prismaFreight.destinationCityId,
      destinationDistrict: prismaFreight.destinationDistrict,
      destinationStreet: prismaFreight.destinationStreet,
      destinationNumber: prismaFreight.destinationNumber,
      dateMode: this.mapDateMode(prismaFreight.dateMode),
      exactDatetime: prismaFreight.exactDatetime,
      availabilityWindow: prismaFreight.availabilityWindow,
      status: this.mapStatus(prismaFreight.status),
      createdAt: prismaFreight.createdAt,
      updatedAt: prismaFreight.updatedAt,
      selectedApplicationId: prismaFreight.selectedApplicationId,
      originCity: {
        id: prismaFreight.originCity.id,
        name: prismaFreight.originCity.name,
        state: prismaFreight.originCity.state,
      },
      destinationCity: {
        id: prismaFreight.destinationCity.id,
        name: prismaFreight.destinationCity.name,
        state: prismaFreight.destinationCity.state,
      },
      coverPhoto,
    });
  }

  static toDomainList(prismaFreights: PrismaFreightWithCities[]): Freight[] {
    return prismaFreights.map((f) => this.toDomain(f));
  }

  static toResponse(freight: Freight): FreightResponseDto {
    return {
      id: freight.id,
      clientId: freight.clientId,
      title: freight.title,
      description: freight.description,
      vehicleCategory: freight.vehicleCategory,
      originCity: freight.originCity,
      originDistrict: freight.originDistrict,
      originStreet: freight.originStreet,
      originNumber: freight.originNumber,
      destinationCity: freight.destinationCity,
      destinationDistrict: freight.destinationDistrict,
      destinationStreet: freight.destinationStreet,
      destinationNumber: freight.destinationNumber,
      dateMode: freight.dateMode,
      exactDatetime: freight.exactDatetime,
      availabilityWindow: freight.availabilityWindow,
      status: freight.status,
      createdAt: freight.createdAt,
      updatedAt: freight.updatedAt,
      selectedApplicationId: freight.selectedApplicationId,
      coverPhoto: freight.coverPhoto,
      hasReviewed: freight.hasReviewed ?? false,
    };
  }

  static toResponseList(freights: Freight[]): FreightResponseDto[] {
    return freights.map((f) => this.toResponse(f));
  }
}
