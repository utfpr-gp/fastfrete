import type { Review } from '../entities/review.entity'
import type { CreateReviewDto } from '../dtos/create-review.dto'
import type { ReviewsFilterDto } from '../dtos/reviews-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IReviewRepository {
  create(freightId: string, data: CreateReviewDto): Promise<HttpResult<Review>>
  findAll(filter: ReviewsFilterDto): Promise<HttpResult<PaginatedResponse<Review>>>
  findByFreight(freightId: string): Promise<HttpResult<Review[]>>
}
