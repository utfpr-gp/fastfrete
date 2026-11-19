import type {
  IVehicleRepository,
  PaginatedResponse,
  VehicleCategory
} from '../repositories/vehicle.repository.interface'
import type { Vehicle } from '../entities/vehicle.entity'
import type { CreateVehicleDto } from '../dtos/create-vehicle.dto'
import type { UpdateVehicleDto } from '../dtos/update-vehicle.dto'
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

  async create(data: CreateVehicleDto): Promise<HttpResult<Vehicle>> {
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateVehicleDto): Promise<HttpResult<Vehicle>> {
    return this.repository.update(id, data)
  }

  async delete(id: string): Promise<HttpResult<void>> {
    return this.repository.delete(id)
  }

  async findAllCategories(): Promise<HttpResult<VehicleCategory[]>> {
    return this.repository.findAllCategories()
  }
}
