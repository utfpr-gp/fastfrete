import { HttpClient } from '../../infra/http/http-client'
import { FreightPhotoHttpRepository } from './repositories/freight-photo-http.repository'
import { FreightPhotoService } from './services/freight-photo.service'

export function createFreightPhotoService(): FreightPhotoService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const freightPhotoRepository = new FreightPhotoHttpRepository(httpClient)
  return new FreightPhotoService(freightPhotoRepository)
}
