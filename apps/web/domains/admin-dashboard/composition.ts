import { HttpClient } from '~~/infra/http/http-client'
import { AdminDashboardHttpRepository } from './repositories/admin-dashboard-http.repository'
import { AdminDashboardService } from './services/admin-dashboard.service'

export function createAdminDashboardService(): AdminDashboardService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const repository = new AdminDashboardHttpRepository(httpClient)
  return new AdminDashboardService(repository)
}
