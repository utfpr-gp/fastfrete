import type { Carrier } from '../entities/carrier.entity'
import type { CarriersFilterDto } from '../dtos/carriers-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ICarrierRepository {
  findAll(filter: CarriersFilterDto): Promise<HttpResult<PaginatedResponse<Carrier>>>
}
