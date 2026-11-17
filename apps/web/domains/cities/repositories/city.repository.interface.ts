import type { City } from '../entities/city.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface ICityRepository {
  findAll(): Promise<HttpResult<City[]>>
}
