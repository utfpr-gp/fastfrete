import type {
  ICarrierRepository,
  PaginatedResponse
} from '../repositories/carrier.repository.interface'
import type { Carrier } from '../entities/carrier.entity'
import type { CarriersFilterDto } from '../dtos/carriers-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class CarrierService {
  private repository: ICarrierRepository

  constructor(repository: ICarrierRepository) {
    this.repository = repository
  }

  async findAll(filter: CarriersFilterDto): Promise<HttpResult<PaginatedResponse<Carrier>>> {
    return this.repository.findAll(filter)
  }
}
