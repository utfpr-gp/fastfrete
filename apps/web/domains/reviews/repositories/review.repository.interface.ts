import type { Review } from '../entities/review.entity'
import type { CreateReviewDto } from '../dtos/create-review.dto'
import type { ReviewsFilterDto } from '../dtos/reviews-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface IReviewRepository {
  create(freightId: string, data: CreateReviewDto): Promise<HttpResult<Review>>
  findAll(filter: ReviewsFilterDto): Promise<HttpResult<PaginatedResponse<Review>>>
  findByFreight(freightId: string): Promise<HttpResult<Review[]>>
}
