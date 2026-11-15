import type { IApplicationRepository } from './application.repository.interface'
import type { Application } from '../entities/application.entity'
import type { UpdateApplicationDto } from '../dtos/update-application.dto'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class ApplicationHttpRepository implements IApplicationRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async findByFreight(freightId: string): Promise<HttpResult<Application[]>> {
    return this.httpClient.get<Application[]>(`/api/freights/${freightId}/applications`)
  }

  async findOne(id: string): Promise<HttpResult<Application>> {
    return this.httpClient.get<Application>(`/api/applications/${id}`)
  }

  async update(id: string, data: UpdateApplicationDto): Promise<HttpResult<Application>> {
    return this.httpClient.patch<Application>(`/api/applications/${id}`, data)
  }

  async accept(id: string): Promise<HttpResult<Application>> {
    return this.httpClient.patch<Application>(`/api/applications/${id}/accept`)
  }

  async reject(id: string): Promise<HttpResult<Application>> {
    return this.httpClient.patch<Application>(`/api/applications/${id}/reject`)
  }

  async complete(id: string): Promise<HttpResult<Application>> {
    return this.httpClient.patch<Application>(`/api/applications/${id}/complete`)
  }

  async withdraw(id: string): Promise<HttpResult<Application>> {
    return this.httpClient.patch<Application>(`/api/applications/${id}/withdraw`)
  }
}
