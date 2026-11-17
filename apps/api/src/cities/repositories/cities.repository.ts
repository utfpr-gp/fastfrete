import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  ICitiesRepository,
  CityData,
} from './cities.repository.interface.js';

@Injectable()
export class CitiesRepository implements ICitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CityData[]> {
    return this.prisma.city.findMany({
      select: { id: true, name: true, state: true },
      orderBy: { name: 'asc' },
    });
  }
}
