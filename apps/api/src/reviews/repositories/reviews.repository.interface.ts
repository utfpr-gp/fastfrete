import { Review } from '../entities/review.entity.js';
import {
  PaginationOptions,
  PaginatedResult,
} from '../../common/pagination/index.js';

export const REVIEWS_REPOSITORY = Symbol('REVIEWS_REPOSITORY');

export interface CreateReviewData {
  freightId: string;
  reviewerId: string;
  reviewedId: string;
  rating: number;
  comment?: string;
}

export interface ReviewsFilters {
  reviewedId?: string;
  freightId?: string;
}

export interface IReviewsRepository {
  create(data: CreateReviewData): Promise<Review>;
  findById(id: string): Promise<Review | null>;
  findByFreightAndReviewer(
    freightId: string,
    reviewerId: string,
  ): Promise<Review | null>;
  findByReviewed(
    reviewedId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Review>>;
  findByFreight(freightId: string): Promise<Review[]>;
}
