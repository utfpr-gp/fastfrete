import type { IAdminDashboardRepository } from '../repositories/admin-dashboard.repository.interface'
import type { AdminMetrics } from '../entities/admin-metrics.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class AdminDashboardService {
  private repository: IAdminDashboardRepository

  constructor(repository: IAdminDashboardRepository) {
    this.repository = repository
  }

  async getMetrics(): Promise<HttpResult<AdminMetrics>> {
    return this.repository.getMetrics()
  }
}
