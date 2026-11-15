import { HttpClient } from '../../infra/http/http-client'
import { VehicleHttpRepository } from './repositories/vehicle-http.repository'
import { VehicleService } from './services/vehicle.service'

export function createVehicleService(): VehicleService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const vehicleRepository = new VehicleHttpRepository(httpClient)
  return new VehicleService(vehicleRepository)
}
