import type {
  IApplicationRepository,
  PaginatedResponse,
  ApplicationsFilterDto
} from '../repositories/application.repository.interface'
import type { Application } from '../entities/application.entity'
import type { CreateApplicationDto } from '../dtos/create-application.dto'
import type { UpdateApplicationDto } from '../dtos/update-application.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class ApplicationService {
  private repository: IApplicationRepository

  constructor(repository: IApplicationRepository) {
    this.repository = repository
  }

  async create(freightId: string, data: CreateApplicationDto): Promise<HttpResult<Application>> {
    return this.repository.create(freightId, data)
  }

  async findByFreight(freightId: string): Promise<HttpResult<Application[]>> {
    return this.repository.findByFreight(freightId)
  }

  async findMyApplications(
    filter: ApplicationsFilterDto
  ): Promise<HttpResult<PaginatedResponse<Application>>> {
    return this.repository.findMyApplications(filter)
  }

  async findOne(id: string): Promise<HttpResult<Application>> {
    return this.repository.findOne(id)
  }

  async update(id: string, data: UpdateApplicationDto): Promise<HttpResult<Application>> {
    return this.repository.update(id, data)
  }

  async accept(id: string): Promise<HttpResult<Application>> {
    return this.repository.accept(id)
  }

  async reject(id: string): Promise<HttpResult<Application>> {
    return this.repository.reject(id)
  }

  async complete(id: string): Promise<HttpResult<Application>> {
    return this.repository.complete(id)
  }

  async withdraw(id: string): Promise<HttpResult<Application>> {
    return this.repository.withdraw(id)
  }
}
