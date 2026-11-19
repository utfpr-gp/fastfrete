import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service.js';
import { VehiclesController } from './controllers/vehicles.controller.js';
import { VehiclesRepository } from './repositories/vehicles.repository.js';
import { VEHICLES_REPOSITORY } from './repositories/vehicles.repository.interface.js';

@Module({
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    {
      provide: VEHICLES_REPOSITORY,
      useClass: VehiclesRepository,
    },
  ],
  exports: [VEHICLES_REPOSITORY],
})
export class VehiclesModule {}
