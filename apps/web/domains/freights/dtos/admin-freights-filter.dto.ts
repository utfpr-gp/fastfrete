import type { FreightStatus } from '../entities/freight.entity'

export interface AdminFreightsFilterDto {
  status?: FreightStatus
  search?: string
  page?: number
  limit?: number
}
