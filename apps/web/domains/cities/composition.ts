import { HttpClient } from '~~/infra/http/http-client'
import { CityHttpRepository } from './repositories/city-http.repository'
import { CityService } from './services/city.service'

export function createCityService(): CityService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const cityRepository = new CityHttpRepository(httpClient)
  return new CityService(cityRepository)
}
