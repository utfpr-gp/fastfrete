import { Review as PrismaReview } from '../../../generated/prisma/client.js';
import { Review } from '../entities/review.entity.js';
import { ReviewResponseDto } from '../dto/review-response.dto.js';

export class ReviewMapper {
  static toDomain(prismaReview: PrismaReview): Review {
    return new Review({
      id: prismaReview.id,
      freightId: prismaReview.freightId,
      reviewerId: prismaReview.reviewerId,
      reviewedId: prismaReview.reviewedId,
      rating: prismaReview.rating,
      comment: prismaReview.comment,
      createdAt: prismaReview.createdAt,
    });
  }

  static toDomainList(prismaReviews: PrismaReview[]): Review[] {
    return prismaReviews.map((r) => this.toDomain(r));
  }

  static toResponse(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      freightId: review.freightId,
      reviewerId: review.reviewerId,
      reviewedId: review.reviewedId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    };
  }

  static toResponseList(reviews: Review[]): ReviewResponseDto[] {
    return reviews.map((r) => this.toResponse(r));
  }
}
