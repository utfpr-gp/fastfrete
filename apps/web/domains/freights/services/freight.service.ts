import type {
  IFreightRepository,
  PaginatedResponse
} from '../repositories/freight.repository.interface'
import type { Freight } from '../entities/freight.entity'
import type { CreateFreightDto } from '../dtos/create-freight.dto'
import type { UpdateFreightDto } from '../dtos/update-freight.dto'
import type { FreightsFilterDto } from '../dtos/freights-filter.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class FreightService {
  private repository: IFreightRepository

  constructor(repository: IFreightRepository) {
    this.repository = repository
  }

  async findAll(filter: FreightsFilterDto): Promise<HttpResult<PaginatedResponse<Freight>>> {
    return this.repository.findAll(filter)
  }

  async findOne(id: string): Promise<HttpResult<Freight>> {
    return this.repository.findOne(id)
  }

  async findAllOpen(filter: FreightsFilterDto): Promise<HttpResult<PaginatedResponse<Freight>>> {
    return this.repository.findAllOpen(filter)
  }

  async findOneOpen(id: string): Promise<HttpResult<Freight>> {
    return this.repository.findOneOpen(id)
  }

  async create(data: CreateFreightDto): Promise<HttpResult<Freight>> {
    return this.repository.create(data)
  }

  async update(id: string, data: UpdateFreightDto): Promise<HttpResult<Freight>> {
    return this.repository.update(id, data)
  }

  async cancel(id: string): Promise<HttpResult<Freight>> {
    return this.repository.cancel(id)
  }
}
