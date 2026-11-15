export interface Review {
  id: string
  freightId: string
  reviewerId: string
  reviewedId: string
  rating: number
  comment: string | null
  createdAt: string
}
