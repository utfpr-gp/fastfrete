export type FreightStatus = 'OPEN' | 'NEGOTIATING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export type FreightDateMode = 'IMMEDIATE' | 'SCHEDULED' | 'FLEXIBLE'

export interface FreightCity {
  id: string
  name: string
  state: string
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
  status: FreightStatus
  selectedApplicationId: string | null
  createdAt: string
  updatedAt: string
}
