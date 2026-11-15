import { HttpClient } from '../../infra/http/http-client'
import { ApplicationHttpRepository } from './repositories/application-http.repository'
import { ApplicationService } from './services/application.service'

export function createApplicationService(): ApplicationService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const applicationRepository = new ApplicationHttpRepository(httpClient)
  return new ApplicationService(applicationRepository)
}
