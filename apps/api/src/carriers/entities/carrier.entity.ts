export interface CarrierVehicle {
  readonly id: string;
  readonly vehicleCategoryId: string;
  readonly vehicleCategoryName: string;
  readonly model: string;
  readonly plate: string;
  readonly capacityKg: number;
  readonly isActive: boolean;
}

export interface CarrierReviewStats {
  readonly averageRating: number;
  readonly totalReviews: number;
}

export class Carrier {
  readonly id: string;
  readonly name: string;
  readonly phoneNumber: string;
  readonly cityName: string;
  readonly vehicles: CarrierVehicle[];
  readonly reviewStats: CarrierReviewStats;

  constructor(props: Carrier) {
    Object.assign(this, props);
  }
}
