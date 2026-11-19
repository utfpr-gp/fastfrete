export interface ReviewReviewer {
  id: string;
  name: string;
  roleType: string | null;
}

export class Review {
  readonly id: string;
  readonly freightId: string;
  readonly reviewerId: string;
  readonly reviewedId: string;
  readonly rating: number;
  readonly comment: string | null;
  readonly createdAt: Date;
  readonly reviewer?: ReviewReviewer;
  readonly freightTitle?: string;

  constructor(props: Review) {
    Object.assign(this, props);
  }
}
