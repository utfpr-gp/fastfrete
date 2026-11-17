import type { Freight, AdminFreight } from '../entities/freight.entity'
import type { CreateFreightDto } from '../dtos/create-freight.dto'
import type { UpdateFreightDto } from '../dtos/update-freight.dto'
import type { FreightsFilterDto } from '../dtos/freights-filter.dto'
import type { AdminFreightsFilterDto } from '../dtos/admin-freights-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface MetaPaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface IFreightRepository {
  findAll(filter: FreightsFilterDto): Promise<HttpResult<PaginatedResponse<Freight>>>
  findOne(id: string): Promise<HttpResult<Freight>>
  findAllOpen(filter: FreightsFilterDto): Promise<HttpResult<PaginatedResponse<Freight>>>
  findOneOpen(id: string): Promise<HttpResult<Freight>>
  create(data: CreateFreightDto): Promise<HttpResult<Freight>>
  update(id: string, data: UpdateFreightDto): Promise<HttpResult<Freight>>
  cancel(id: string): Promise<HttpResult<Freight>>
  findAllAdmin(
    filter: AdminFreightsFilterDto
  ): Promise<HttpResult<MetaPaginatedResponse<AdminFreight>>>
}
