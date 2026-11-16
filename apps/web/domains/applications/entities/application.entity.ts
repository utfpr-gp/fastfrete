export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'COMPLETED'

export interface ApplicationVehicle {
  id: string
  model: string
  plate: string | null
  capacityKg: string
  color: string | null
  vehicleCategoryName: string
}

export interface Application {
  id: string
  freightId: string
  freighterId: string
  vehicleId: string
  vehicle: ApplicationVehicle | null
  proposedPrice: string
  message?: string | null
  status: ApplicationStatus
  hasReviewed?: boolean
  createdAt: string
  updatedAt: string
}
