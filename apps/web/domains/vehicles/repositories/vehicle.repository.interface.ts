import type { Vehicle } from '../entities/vehicle.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface IVehicleRepository {
  findAll(filter?: { limit?: number }): Promise<HttpResult<PaginatedResponse<Vehicle>>>
  findOne(id: string): Promise<HttpResult<Vehicle>>
}
