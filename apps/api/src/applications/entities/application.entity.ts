export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  COMPLETED = 'COMPLETED',
}

export interface ApplicationVehicle {
  readonly id: string;
  readonly model: string;
  readonly plate: string | null;
  readonly capacityKg: string;
  readonly color: string | null;
  readonly vehicleCategoryName: string;
}

export class Application {
  readonly id: string;
  readonly freightId: string;
  readonly freighterId: string;
  readonly vehicleId: string;
  readonly vehicle: ApplicationVehicle | null;
  readonly proposedPrice: string;
  readonly message?: string | null;
  readonly status: ApplicationStatus;
  readonly hasReviewed?: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: Application) {
    Object.assign(this, props);
  }
}
