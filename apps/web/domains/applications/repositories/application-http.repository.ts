import type { IApplicationRepository, PaginatedResponse, ApplicationsFilterDto } from './application.repository.interface'
import type { Application } from '../entities/application.entity'
import type { CreateApplicationDto } from '../dtos/create-application.dto'
import type { UpdateApplicationDto } from '../dtos/update-application.dto'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class ApplicationHttpRepository implements IApplicationRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async create(freightId: string, data: CreateApplicationDto): Promise<HttpResult<Application>> {
    return this.httpClient.post<Application>(`/api/freights/${freightId}/applications`, data)
  }

  async findByFreight(freightId: string): Promise<HttpResult<Application[]>> {
    return this.httpClient.get<Application[]>(`/api/freights/${freightId}/applications`)
  }

  async findMyApplications(filter: ApplicationsFilterDto): Promise<HttpResult<PaginatedResponse<Application>>> {
    const params: Record<string, string | number> = {}
    if (filter.status) params.status = filter.status
    if (filter.freightId) params.freightId = filter.freightId
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit
    return this.httpClient.get<PaginatedResponse<Application>>('/api/me/applications', { params })
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
