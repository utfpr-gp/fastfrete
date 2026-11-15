import type { IVehicleRepository, PaginatedResponse } from '../repositories/vehicle.repository.interface'
import type { Vehicle } from '../entities/vehicle.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class VehicleService {
  private repository: IVehicleRepository

  constructor(repository: IVehicleRepository) {
    this.repository = repository
  }

  async findAll(filter?: { limit?: number }): Promise<HttpResult<PaginatedResponse<Vehicle>>> {
    return this.repository.findAll(filter)
  }

  async findOne(id: string): Promise<HttpResult<Vehicle>> {
    return this.repository.findOne(id)
  }
}
