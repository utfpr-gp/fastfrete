import { ApiProperty } from '@nestjs/swagger';

class CarrierVehicleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicleCategoryId: string;

  @ApiProperty()
  vehicleCategoryName: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  plate: string;

  @ApiProperty()
  capacityKg: number;

  @ApiProperty()
  isActive: boolean;
}

class CarrierReviewStatsDto {
  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  totalReviews: number;
}

export class CarrierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  cityName: string;

  @ApiProperty({ type: [CarrierVehicleDto] })
  vehicles: CarrierVehicleDto[];

  @ApiProperty({ type: CarrierReviewStatsDto })
  reviewStats: CarrierReviewStatsDto;
}
