export interface UsersMetrics {
  total: number
  customers: number
  carriers: number
  suspended: number
}

export interface FreightsMetrics {
  total: number
  open: number
  negotiating: number
  inProgress: number
  completed: number
  cancelled: number
}

export interface ApplicationsMetrics {
  total: number
  pending: number
  accepted: number
  rejected: number
  withdrawn: number
  completed: number
}

export interface ReviewsMetrics {
  total: number
  averageRating: number
}

export interface AdminMetrics {
  users: UsersMetrics
  freights: FreightsMetrics
  applications: ApplicationsMetrics
  reviews: ReviewsMetrics
}
