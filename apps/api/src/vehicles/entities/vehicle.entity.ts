export class Vehicle {
  readonly id: string;
  readonly userId: string;
  readonly vehicleCategoryId: string;
  readonly vehicleCategoryName: string;
  readonly model: string;
  readonly plate: string | null;
  readonly capacityKg: string;
  readonly color: string | null;
  readonly active: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: Vehicle) {
    Object.assign(this, props);
  }
}
