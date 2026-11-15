import type { IReviewRepository, PaginatedResponse } from '../repositories/review.repository.interface'
import type { Review } from '../entities/review.entity'
import type { CreateReviewDto } from '../dtos/create-review.dto'
import type { ReviewsFilterDto } from '../dtos/reviews-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class ReviewService {
  private repository: IReviewRepository

  constructor(repository: IReviewRepository) {
    this.repository = repository
  }

  async create(freightId: string, data: CreateReviewDto): Promise<HttpResult<Review>> {
    return this.repository.create(freightId, data)
  }

  async findAll(filter: ReviewsFilterDto): Promise<HttpResult<PaginatedResponse<Review>>> {
    return this.repository.findAll(filter)
  }

  async findByFreight(freightId: string): Promise<HttpResult<Review[]>> {
    return this.repository.findByFreight(freightId)
  }
}
