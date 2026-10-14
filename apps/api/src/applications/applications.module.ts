import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service.js';
import { ApplicationsController } from './controllers/applications.controller.js';
import { FreightApplicationsController } from './controllers/freight-applications.controller.js';
import { MeApplicationsController } from './controllers/me-applications.controller.js';
import { ApplicationsRepository } from './repositories/applications.repository.js';
import { APPLICATIONS_REPOSITORY } from './repositories/applications.repository.interface.js';
import { FreightsModule } from '../freights/freights.module.js';

@Module({
  imports: [FreightsModule],
  controllers: [
    ApplicationsController,
    FreightApplicationsController,
    MeApplicationsController,
  ],
  providers: [
    ApplicationsService,
    {
      provide: APPLICATIONS_REPOSITORY,
      useClass: ApplicationsRepository,
    },
  ],
})
export class ApplicationsModule {}
