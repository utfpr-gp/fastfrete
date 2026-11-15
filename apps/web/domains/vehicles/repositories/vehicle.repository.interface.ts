import type { Vehicle } from '../entities/vehicle.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IVehicleRepository {
  findAll(filter?: { limit?: number }): Promise<HttpResult<PaginatedResponse<Vehicle>>>
  findOne(id: string): Promise<HttpResult<Vehicle>>
}
