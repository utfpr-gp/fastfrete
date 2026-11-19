import type { ICityRepository } from '../repositories/city.repository.interface'
import type { City } from '../entities/city.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class CityService {
  private repository: ICityRepository

  constructor(repository: ICityRepository) {
    this.repository = repository
  }

  async findAll(): Promise<HttpResult<City[]>> {
    return this.repository.findAll()
  }
}
