import { Review as PrismaReview } from '../../../generated/prisma/client.js';
import { Review } from '../entities/review.entity.js';
import { ReviewResponseDto } from '../dto/review-response.dto.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { abbreviateName } from '../../common/utils/name.util.js';

type PrismaReviewWithRelations = PrismaReview & {
  reviewer?: {
    id: string;
    name: string;
    userRoles: { role: { roleType: { name: string } } }[];
  };
  freight?: { title: string };
};

export class ReviewMapper {
  static toDomain(prismaReview: PrismaReviewWithRelations): Review {
    const reviewerRoleTypes =
      prismaReview.reviewer?.userRoles.map((ur) => ur.role.roleType.name) ?? [];
    const reviewerRoleType = reviewerRoleTypes.includes(RoleTypeEnum.CARRIER)
      ? RoleTypeEnum.CARRIER
      : (reviewerRoleTypes[0] ?? null);

    return new Review({
      id: prismaReview.id,
      freightId: prismaReview.freightId,
      reviewerId: prismaReview.reviewerId,
      reviewedId: prismaReview.reviewedId,
      rating: prismaReview.rating,
      comment: prismaReview.comment,
      createdAt: prismaReview.createdAt,
      reviewer: prismaReview.reviewer
        ? {
            id: prismaReview.reviewer.id,
            name: prismaReview.reviewer.name,
            roleType: reviewerRoleType,
          }
        : undefined,
      freightTitle: prismaReview.freight?.title,
    });
  }

  static toDomainList(prismaReviews: PrismaReviewWithRelations[]): Review[] {
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
      reviewer: review.reviewer
        ? {
            id: review.reviewer.id,
            name:
              review.reviewer.roleType === RoleTypeEnum.CARRIER
                ? review.reviewer.name
                : abbreviateName(review.reviewer.name),
            roleType: review.reviewer.roleType,
          }
        : undefined,
      freightTitle: review.freightTitle,
    };
  }

  static toResponseList(reviews: Review[]): ReviewResponseDto[] {
    return reviews.map((r) => this.toResponse(r));
  }
}
