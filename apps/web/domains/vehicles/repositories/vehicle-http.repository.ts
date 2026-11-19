import type {
  IVehicleRepository,
  PaginatedResponse,
  VehicleCategory
} from './vehicle.repository.interface'
import type { Vehicle } from '../entities/vehicle.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'
import type { CreateVehicleDto } from '../dtos/create-vehicle.dto'
import type { UpdateVehicleDto } from '../dtos/update-vehicle.dto'

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

  async create(data: CreateVehicleDto): Promise<HttpResult<Vehicle>> {
    return this.httpClient.post<Vehicle>('/api/vehicles', data)
  }

  async update(id: string, data: UpdateVehicleDto): Promise<HttpResult<Vehicle>> {
    return this.httpClient.patch<Vehicle>(`/api/vehicles/${id}`, data)
  }

  async delete(id: string): Promise<HttpResult<void>> {
    return this.httpClient.delete<void>(`/api/vehicles/${id}`)
  }

  async findAllCategories(): Promise<HttpResult<VehicleCategory[]>> {
    return this.httpClient.get<VehicleCategory[]>('/api/vehicles/categories')
  }
}
