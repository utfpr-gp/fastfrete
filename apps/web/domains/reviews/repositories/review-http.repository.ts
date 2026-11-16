import type { IReviewRepository, PaginatedResponse } from './review.repository.interface'
import type { Review } from '../entities/review.entity'
import type { CreateReviewDto } from '../dtos/create-review.dto'
import type { ReviewsFilterDto } from '../dtos/reviews-filter.dto'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class ReviewHttpRepository implements IReviewRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async create(freightId: string, data: CreateReviewDto): Promise<HttpResult<Review>> {
    return this.httpClient.post<Review>(`/api/freights/${freightId}/reviews`, data)
  }

  async findAll(filter: ReviewsFilterDto): Promise<HttpResult<PaginatedResponse<Review>>> {
    const params: Record<string, string | number> = {}

    if (filter.reviewedId) params.reviewedId = filter.reviewedId
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit

    return this.httpClient.get<PaginatedResponse<Review>>(
      `/api/reviews/users/${filter.reviewedId}`,
      { params }
    )
  }

  async findByFreight(freightId: string): Promise<HttpResult<Review[]>> {
    return this.httpClient.get<Review[]>(`/api/freights/${freightId}/reviews`)
  }
}
