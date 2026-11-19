import type { Vehicle } from '../entities/vehicle.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'
import type { CreateVehicleDto } from '../dtos/create-vehicle.dto'
import type { UpdateVehicleDto } from '../dtos/update-vehicle.dto'

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

export interface VehicleCategory {
  id: string
  name: string
}

export interface IVehicleRepository {
  findAll(filter?: { limit?: number }): Promise<HttpResult<PaginatedResponse<Vehicle>>>
  findOne(id: string): Promise<HttpResult<Vehicle>>
  create(data: CreateVehicleDto): Promise<HttpResult<Vehicle>>
  update(id: string, data: UpdateVehicleDto): Promise<HttpResult<Vehicle>>
  delete(id: string): Promise<HttpResult<void>>
  findAllCategories(): Promise<HttpResult<VehicleCategory[]>>
}
