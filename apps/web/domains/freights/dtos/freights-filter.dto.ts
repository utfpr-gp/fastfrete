import type { FreightStatus } from '../entities/freight.entity'

export type FreightOrderBy = 'recent' | 'oldest'

export interface FreightsFilterDto {
  status?: FreightStatus | FreightStatus[]
  vehicleCategory?: string
  cityId?: string
  compatibleOnly?: boolean
  orderBy?: FreightOrderBy
  page?: number
  limit?: number
}
