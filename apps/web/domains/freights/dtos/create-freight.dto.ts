import type { FreightDateMode } from '../entities/freight.entity'

export interface CreateFreightDto {
  title: string
  description: string
  vehicleCategory: string
  originCityId: string
  originDistrict: string
  originStreet: string
  originNumber: string
  destinationCityId: string
  destinationDistrict: string
  destinationStreet: string
  destinationNumber: string
  dateMode: FreightDateMode
  exactDatetime?: string
  availabilityWindow?: string
  suggestedPrice?: number | null
}
