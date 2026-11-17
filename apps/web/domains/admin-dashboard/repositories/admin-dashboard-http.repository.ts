import type { IAdminDashboardRepository } from './admin-dashboard.repository.interface'
import type { AdminMetrics } from '../entities/admin-metrics.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class AdminDashboardHttpRepository implements IAdminDashboardRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getMetrics(): Promise<HttpResult<AdminMetrics>> {
    return this.httpClient.get<AdminMetrics>('/api/admin/dashboard/metrics')
  }
}
