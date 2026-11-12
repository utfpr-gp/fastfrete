import type { FreightStatus } from '../entities/freight.entity'

export interface FreightsFilterDto {
  status?: FreightStatus | FreightStatus[]
  page?: number
  limit?: number
}
