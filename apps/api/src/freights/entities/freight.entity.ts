export enum FreightStatus {
  OPEN = 'OPEN',
  NEGOTIATING = 'NEGOTIATING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum FreightDateMode {
  IMMEDIATE = 'IMMEDIATE',
  SCHEDULED = 'SCHEDULED',
  FLEXIBLE = 'FLEXIBLE',
}

export interface FreightCity {
  readonly id: string;
  readonly name: string;
  readonly state: string;
}

export class Freight {
  readonly id: string;
  readonly clientId: string;
  readonly title: string;
  readonly description: string;
  readonly vehicleCategory: string;
  readonly originCityId: string;
  readonly originDistrict: string;
  readonly originStreet: string;
  readonly originNumber: string;
  readonly destinationCityId: string;
  readonly destinationDistrict: string;
  readonly destinationStreet: string;
  readonly destinationNumber: string;
  readonly dateMode: FreightDateMode;
  readonly exactDatetime: Date | null;
  readonly availabilityWindow: string | null;
  readonly suggestedPrice: number | null;
  readonly status: FreightStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly selectedApplicationId: string | null;
  readonly originCity: FreightCity;
  readonly destinationCity: FreightCity;
  readonly coverPhoto: string | null;
  readonly hasReviewed?: boolean;

  constructor(props: Freight) {
    Object.assign(this, props);
  }
}
