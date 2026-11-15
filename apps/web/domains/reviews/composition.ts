import { HttpClient } from '../../infra/http/http-client'
import { ReviewHttpRepository } from './repositories/review-http.repository'
import { ReviewService } from './services/review.service'

export function createReviewService(): ReviewService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const reviewRepository = new ReviewHttpRepository(httpClient)
  return new ReviewService(reviewRepository)
}
