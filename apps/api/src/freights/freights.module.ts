import { Module } from '@nestjs/common';
import { FreightsService } from './freights.service.js';
import { FreightsController } from './controllers/freights.controller.js';
import { CarrierFreightsController } from './controllers/carrier-freights.controller.js';
import { FreightsRepository } from './repositories/freights.repository.js';
import { FREIGHTS_REPOSITORY } from './repositories/freights.repository.interface.js';

@Module({
  controllers: [FreightsController, CarrierFreightsController],
  providers: [
    FreightsService,
    {
      provide: FREIGHTS_REPOSITORY,
      useClass: FreightsRepository,
    },
  ],
  exports: [FREIGHTS_REPOSITORY],
})
export class FreightsModule {}
