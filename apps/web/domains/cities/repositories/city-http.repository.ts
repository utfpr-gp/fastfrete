import type { ICityRepository } from './city.repository.interface'
import type { City } from '../entities/city.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class CityHttpRepository implements ICityRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async findAll(): Promise<HttpResult<City[]>> {
    return this.httpClient.get<City[]>('/api/cities')
  }
}
