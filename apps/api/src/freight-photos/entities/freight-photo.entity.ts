export class FreightPhoto {
  readonly id: string;
  readonly freightId: string;
  readonly url: string;
  readonly order: number;
  readonly createdAt: Date;

  constructor(props: FreightPhoto) {
    Object.assign(this, props);
  }
}
