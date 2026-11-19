import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { FreightReviewsController } from './controllers/freight-reviews.controller.js';
import { ReviewsController } from './controllers/reviews.controller.js';
import { ReviewsRepository } from './repositories/reviews.repository.js';
import { REVIEWS_REPOSITORY } from './repositories/reviews.repository.interface.js';
import { FreightsModule } from '../freights/freights.module.js';
import { ApplicationsModule } from '../applications/applications.module.js';

@Module({
  imports: [forwardRef(() => FreightsModule), forwardRef(() => ApplicationsModule)],
  controllers: [FreightReviewsController, ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: REVIEWS_REPOSITORY,
      useClass: ReviewsRepository,
    },
  ],
  exports: [REVIEWS_REPOSITORY],
})
export class ReviewsModule {}
