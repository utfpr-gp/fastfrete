export type FreightStatus = 'OPEN' | 'NEGOTIATING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export type FreightDateMode = 'IMMEDIATE' | 'SCHEDULED' | 'FLEXIBLE'

export interface FreightCity {
  id: string
  name: string
  state: string
}

export interface FreightClientSummary {
  name: string
  averageRating: number
  totalReviews: number
  completedFreights: number
}

export interface Freight {
  id: string
  clientId: string
  title: string
  description: string
  vehicleCategory: string
  originCity: FreightCity
  originDistrict: string
  originStreet: string
  originNumber: string
  destinationCity: FreightCity
  destinationDistrict: string
  destinationStreet: string
  destinationNumber: string
  dateMode: FreightDateMode
  exactDatetime: string | null
  availabilityWindow: string | null
  suggestedPrice: number | null
  status: FreightStatus
  selectedApplicationId: string | null
  hasReviewed?: boolean
  client?: FreightClientSummary
  createdAt: string
  updatedAt: string
  coverPhoto: string | null
}

export interface AdminFreight extends Freight {
  clientName: string
  applicationsCount: number
}
