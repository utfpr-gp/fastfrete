import type {
  IFreightRepository,
  PaginatedResponse,
  MetaPaginatedResponse
} from './freight.repository.interface'
import type { Freight, AdminFreight } from '../entities/freight.entity'
import type { CreateFreightDto } from '../dtos/create-freight.dto'
import type { UpdateFreightDto } from '../dtos/update-freight.dto'
import type { FreightsFilterDto } from '../dtos/freights-filter.dto'
import type { AdminFreightsFilterDto } from '../dtos/admin-freights-filter.dto'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class FreightHttpRepository implements IFreightRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async findAll(filter: FreightsFilterDto): Promise<HttpResult<PaginatedResponse<Freight>>> {
    const params: Record<string, string | number> = {}

    if (filter.status) {
      if (Array.isArray(filter.status)) {
        params.status = filter.status.join(',')
      } else {
        params.status = filter.status
      }
    }

    if (filter.vehicleCategory) params.vehicleCategory = filter.vehicleCategory
    if (filter.orderBy) params.orderBy = filter.orderBy
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit

    return this.httpClient.get<PaginatedResponse<Freight>>('/api/freights', { params })
  }

  async findAllAdmin(
    filter: AdminFreightsFilterDto
  ): Promise<HttpResult<MetaPaginatedResponse<AdminFreight>>> {
    const params: Record<string, string | number> = {}

    if (filter.status) params.status = filter.status
    if (filter.search) params.search = filter.search
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit

    return this.httpClient.get<MetaPaginatedResponse<AdminFreight>>('/api/admin/freights', {
      params
    })
  }

  async findOne(id: string): Promise<HttpResult<Freight>> {
    return this.httpClient.get<Freight>(`/api/freights/${id}`)
  }

  async findAllOpen(filter: FreightsFilterDto): Promise<HttpResult<PaginatedResponse<Freight>>> {
    const params: Record<string, string | number> = {}

    if (filter.vehicleCategory) params.vehicleCategory = filter.vehicleCategory
    if (filter.orderBy) params.orderBy = filter.orderBy
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit

    return this.httpClient.get<PaginatedResponse<Freight>>('/api/carrier/freights', { params })
  }

  async findOneOpen(id: string): Promise<HttpResult<Freight>> {
    return this.httpClient.get<Freight>(`/api/carrier/freights/${id}`)
  }

  async create(data: CreateFreightDto): Promise<HttpResult<Freight>> {
    return this.httpClient.post<Freight>('/api/freights', data)
  }

  async update(id: string, data: UpdateFreightDto): Promise<HttpResult<Freight>> {
    return this.httpClient.patch<Freight>(`/api/freights/${id}`, data)
  }

  async cancel(id: string): Promise<HttpResult<Freight>> {
    return this.httpClient.patch<Freight>(`/api/freights/${id}/cancel`)
  }
}
