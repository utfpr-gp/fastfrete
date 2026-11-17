import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service.js';
import { CitiesController } from './controllers/cities.controller.js';
import { CITIES_REPOSITORY } from './repositories/cities.repository.interface.js';
import { CitiesRepository } from './repositories/cities.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CitiesController],
  providers: [
    CitiesService,
    {
      provide: CITIES_REPOSITORY,
      useClass: CitiesRepository,
    },
  ],
})
export class CitiesModule {}
