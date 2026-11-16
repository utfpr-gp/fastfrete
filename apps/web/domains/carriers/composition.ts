import { HttpClient } from '../../infra/http/http-client'
import { CarrierHttpRepository } from './repositories/carrier-http.repository'
import { CarrierService } from './services/carrier.service'

export function createCarrierService(): CarrierService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const carrierRepository = new CarrierHttpRepository(httpClient)
  return new CarrierService(carrierRepository)
}
