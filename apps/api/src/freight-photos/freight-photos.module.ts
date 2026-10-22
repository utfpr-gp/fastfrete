import { Module } from '@nestjs/common';
import { FreightPhotosService } from './freight-photos.service.js';
import { FreightPhotosController } from './controllers/freight-photos.controller.js';
import { FreightPhotosRepository } from './repositories/freight-photos.repository.js';
import { FREIGHT_PHOTOS_REPOSITORY } from './repositories/freight-photos.repository.interface.js';
import { FreightsModule } from '../freights/freights.module.js';

@Module({
  imports: [FreightsModule],
  controllers: [FreightPhotosController],
  providers: [
    FreightPhotosService,
    {
      provide: FREIGHT_PHOTOS_REPOSITORY,
      useClass: FreightPhotosRepository,
    },
  ],
})
export class FreightPhotosModule {}
