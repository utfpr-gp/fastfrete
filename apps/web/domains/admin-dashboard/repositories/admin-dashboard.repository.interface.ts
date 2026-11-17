import type { AdminMetrics } from '../entities/admin-metrics.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface IAdminDashboardRepository {
  getMetrics(): Promise<HttpResult<AdminMetrics>>
}
