export interface CarrierVehicle {
  id: string
  vehicleCategoryId: string
  vehicleCategoryName: string
  model: string
  plate: string
  capacityKg: number
  isActive: boolean
}

export interface CarrierReviewStats {
  averageRating: number
  totalReviews: number
}

export interface Carrier {
  id: string
  name: string
  phoneNumber: string
  cityName: string
  vehicles: CarrierVehicle[]
  reviewStats: CarrierReviewStats
}
