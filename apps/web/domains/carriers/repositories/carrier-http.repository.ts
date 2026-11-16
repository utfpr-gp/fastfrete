import type { ICarrierRepository, PaginatedResponse } from './carrier.repository.interface'
import type { Carrier } from '../entities/carrier.entity'
import type { CarriersFilterDto } from '../dtos/carriers-filter.dto'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class CarrierHttpRepository implements ICarrierRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async findAll(filter: CarriersFilterDto): Promise<HttpResult<PaginatedResponse<Carrier>>> {
    const params: Record<string, string | number> = {}

    if (filter.vehicleCategory) params.vehicleCategory = filter.vehicleCategory
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit

    return this.httpClient.get<PaginatedResponse<Carrier>>('/api/carriers', { params })
  }
}
