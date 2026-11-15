import type { IApplicationRepository } from '../repositories/application.repository.interface'
import type { Application } from '../entities/application.entity'
import type { UpdateApplicationDto } from '../dtos/update-application.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class ApplicationService {
  private repository: IApplicationRepository

  constructor(repository: IApplicationRepository) {
    this.repository = repository
  }

  async findByFreight(freightId: string): Promise<HttpResult<Application[]>> {
    return this.repository.findByFreight(freightId)
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
