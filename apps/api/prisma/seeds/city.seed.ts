import { PrismaClient, City } from '../../generated/prisma/client';
import { seed, SeedResult } from './seed.helper';

export interface SeededCity {
  id: string;
  name: string;
  state: string;
}

const citiesData = [{ name: 'Guarapuava', state: 'Paraná' }];

export async function seedCities(prisma: PrismaClient): Promise<SeedResult<SeededCity>> {
  return seed({
    name: 'cities',
    data: citiesData,
    model: prisma.city as any,
    getUniqueKey: (item) => ({ name_state: { name: item.name, state: item.state } }),
    toResult: (city: unknown) => {
      const c = city as City;
      return { id: c.id, name: c.name, state: c.state };
    },
  });
}

export function getDefaultCity(cities: SeededCity[]): SeededCity {
  const city = cities.find((c) => c.name === 'Guarapuava' && c.state === 'Paraná');
  if (!city) throw new Error('Default city "Guarapuava/Paraná" not found after seeding');
  return city;
}
