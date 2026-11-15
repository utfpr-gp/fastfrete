import type { IVehicleRepository, PaginatedResponse } from './vehicle.repository.interface'
import type { Vehicle } from '../entities/vehicle.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class VehicleHttpRepository implements IVehicleRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async findAll(filter?: { limit?: number }): Promise<HttpResult<PaginatedResponse<Vehicle>>> {
    const params: Record<string, string | number> = {}
    if (filter?.limit) params.limit = filter.limit
    return this.httpClient.get<PaginatedResponse<Vehicle>>('/api/vehicles', { params })
  }

  async findOne(id: string): Promise<HttpResult<Vehicle>> {
    return this.httpClient.get<Vehicle>(`/api/vehicles/${id}`)
  }
}
