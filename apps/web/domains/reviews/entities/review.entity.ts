export interface ReviewReviewer {
  id: string
  name: string
  roleType: string | null
}

export interface Review {
  id: string
  freightId: string
  reviewerId: string
  reviewedId: string
  rating: number
  comment: string | null
  createdAt: string
  reviewer?: ReviewReviewer
  freightTitle?: string
}
