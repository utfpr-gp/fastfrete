export type PublicProfileRole = 'CUSTOMER' | 'CARRIER'

export interface PublicProfileVehicle {
  id: string
  vehicleCategoryName: string
  model: string
  capacityKg: number
}

export interface PublicProfileStats {
  averageRating: number
  totalReviews: number
  completedFreights: number
}

export interface PublicProfile {
  id: string
  name: string
  roleType: PublicProfileRole
  cityName: string
  memberSince: string
  stats: PublicProfileStats
  vehicles: PublicProfileVehicle[]
}
