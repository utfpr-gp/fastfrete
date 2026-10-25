export class Review {
  readonly id: string;
  readonly freightId: string;
  readonly reviewerId: string;
  readonly reviewedId: string;
  readonly rating: number;
  readonly comment: string | null;
  readonly createdAt: Date;

  constructor(props: Review) {
    Object.assign(this, props);
  }
}
