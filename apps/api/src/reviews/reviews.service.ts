import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import type { IReviewsRepository } from './repositories/reviews.repository.interface.js';
import { REVIEWS_REPOSITORY } from './repositories/reviews.repository.interface.js';
import type { IFreightsRepository } from '../freights/repositories/freights.repository.interface.js';
import { FREIGHTS_REPOSITORY } from '../freights/repositories/freights.repository.interface.js';
import type { IApplicationsRepository } from '../applications/repositories/applications.repository.interface.js';
import { APPLICATIONS_REPOSITORY } from '../applications/repositories/applications.repository.interface.js';
import { ReviewMapper } from './mappers/review.mapper.js';
import { FreightStatus } from '../freights/entities/freight.entity.js';
import { ApplicationStatus } from '../applications/entities/application.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewResponseDto } from './dto/review-response.dto.js';
import { ReviewsFilterDto } from './dto/reviews-filter.dto.js';
import { PaginatedResponseDto } from '../common/pagination/index.js';

@Injectable()
export class ReviewsService {
  constructor(
    @Inject(REVIEWS_REPOSITORY)
    private readonly reviewsRepository: IReviewsRepository,
    @Inject(FREIGHTS_REPOSITORY)
    private readonly freightsRepository: IFreightsRepository,
    @Inject(APPLICATIONS_REPOSITORY)
    private readonly applicationsRepository: IApplicationsRepository,
  ) {}

  async create(
    freightId: string,
    reviewerId: string,
    dto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    if (freight.status !== FreightStatus.COMPLETED) {
      throw new ForbiddenException(
        'Só é possível avaliar fretes concluídos',
      );
    }

    if (!freight.selectedApplicationId) {
      throw new ForbiddenException(
        'Frete sem aplicação selecionada não pode ser avaliado',
      );
    }

    const application = await this.applicationsRepository.findById(
      freight.selectedApplicationId,
    );

    if (!application) {
      throw new NotFoundException('Aplicação selecionada não encontrada');
    }

    if (application.status !== ApplicationStatus.COMPLETED) {
      throw new ForbiddenException(
        'Só é possível avaliar quando a aplicação está concluída',
      );
    }

    let reviewedId: string;

    if (reviewerId === freight.clientId) {
      reviewedId = application.freighterId;
    } else if (reviewerId === application.freighterId) {
      reviewedId = freight.clientId;
    } else {
      throw new ForbiddenException(
        'Você não faz parte deste frete e não pode avaliá-lo',
      );
    }

    const existing = await this.reviewsRepository.findByFreightAndReviewer(
      freightId,
      reviewerId,
    );

    if (existing) {
      throw new ConflictException(
        'Você já avaliou este frete',
      );
    }

    const review = await this.reviewsRepository.create({
      freightId,
      reviewerId,
      reviewedId,
      rating: dto.rating,
      comment: dto.comment,
    });

    return ReviewMapper.toResponse(review);
  }

  async findByFreight(
    freightId: string,
  ): Promise<ReviewResponseDto[]> {
    const freight = await this.freightsRepository.findById(freightId);

    if (!freight) {
      throw new NotFoundException(`Frete com ID ${freightId} não encontrado`);
    }

    const reviews = await this.reviewsRepository.findByFreight(freightId);

    return ReviewMapper.toResponseList(reviews);
  }

  async findByReviewed(
    reviewedId: string,
    filterDto: ReviewsFilterDto,
  ): Promise<PaginatedResponseDto<ReviewResponseDto>> {
    const { page = 1, limit = 10 } = filterDto;

    const result = await this.reviewsRepository.findByReviewed(reviewedId, {
      page,
      limit,
    });

    return PaginatedResponseDto.create({
      data: ReviewMapper.toResponseList(result.data),
      total: result.total,
      page,
      limit,
    });
  }
}
