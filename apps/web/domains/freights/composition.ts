import { HttpClient } from '../../infra/http/http-client'
import { FreightHttpRepository } from './repositories/freight-http.repository'
import { FreightService } from './services/freight.service'

export function createFreightService(): FreightService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const freightRepository = new FreightHttpRepository(httpClient)
  return new FreightService(freightRepository)
}
