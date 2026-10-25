import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  IReviewsRepository,
  CreateReviewData,
  ReviewsFilters,
} from './reviews.repository.interface.js';
import { Review } from '../entities/review.entity.js';
import { ReviewMapper } from '../mappers/review.mapper.js';
import {
  PaginationOptions,
  PaginatedResult,
  buildPrismaPagination,
  buildWhereClause,
  FilterMode,
} from '../../common/pagination/index.js';

@Injectable()
export class ReviewsRepository implements IReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewData): Promise<Review> {
    const prismaReview = await this.prisma.review.create({
      data: {
        freightId: data.freightId,
        reviewerId: data.reviewerId,
        reviewedId: data.reviewedId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    return ReviewMapper.toDomain(prismaReview);
  }

  async findById(id: string): Promise<Review | null> {
    const prismaReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!prismaReview) return null;
    return ReviewMapper.toDomain(prismaReview);
  }

  async findByFreightAndReviewer(
    freightId: string,
    reviewerId: string,
  ): Promise<Review | null> {
    const prismaReview = await this.prisma.review.findUnique({
      where: { freightId_reviewerId: { freightId, reviewerId } },
    });

    if (!prismaReview) return null;
    return ReviewMapper.toDomain(prismaReview);
  }

  async findByReviewed(
    reviewedId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Review>> {
    const { skip, take } = buildPrismaPagination(pagination);

    const where = buildWhereClause([
      { field: 'reviewedId', mode: FilterMode.EQUALS, value: reviewedId },
    ]);

    const [total, prismaReviews] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: ReviewMapper.toDomainList(prismaReviews),
      total,
    };
  }

  async findByFreight(freightId: string): Promise<Review[]> {
    const prismaReviews = await this.prisma.review.findMany({
      where: { freightId },
      orderBy: { createdAt: 'desc' },
    });

    return ReviewMapper.toDomainList(prismaReviews);
  }
}
