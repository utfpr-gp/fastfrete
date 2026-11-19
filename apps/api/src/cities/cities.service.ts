import { Inject, Injectable } from '@nestjs/common';
import type { ICitiesRepository } from './repositories/cities.repository.interface.js';
import { CITIES_REPOSITORY } from './repositories/cities.repository.interface.js';
import { CityResponseDto } from './dto/city-response.dto.js';

@Injectable()
export class CitiesService {
  constructor(
    @Inject(CITIES_REPOSITORY)
    private readonly citiesRepository: ICitiesRepository,
  ) {}

  async findAll(): Promise<CityResponseDto[]> {
    const cities = await this.citiesRepository.findAll();
    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
    }));
  }
}
