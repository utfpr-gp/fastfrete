import type { Carrier } from '../entities/carrier.entity'
import type { CarriersFilterDto } from '../dtos/carriers-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ICarrierRepository {
  findAll(filter: CarriersFilterDto): Promise<HttpResult<PaginatedResponse<Carrier>>>
}
