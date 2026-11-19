export const CITIES_REPOSITORY = Symbol('CITIES_REPOSITORY');

export interface CityData {
  id: string;
  name: string;
  state: string;
}

export interface ICitiesRepository {
  findAll(): Promise<CityData[]>;
}
