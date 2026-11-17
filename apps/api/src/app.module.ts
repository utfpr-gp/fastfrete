import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CryptoModule } from './common/crypto/crypto.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { FreightsModule } from './freights/freights.module';
import { ApplicationsModule } from './applications/applications.module';
import { VehiclesModule } from './vehicles/vehicles.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { FreightPhotosModule } from './freight-photos/freight-photos.module.js';
import { CarriersModule } from './carriers/carriers.module.js';
import { AdminDashboardModule } from './admin-dashboard/admin-dashboard.module.js';
import { CitiesModule } from './cities/cities.module.js';

@Module({
  imports: [
    PrismaModule,
    CryptoModule,
    AuthorizationModule,
    AuthenticationModule,
    UsersModule,
    FreightsModule,
    ApplicationsModule,
    VehiclesModule,
    ReviewsModule,
    FreightPhotosModule,
    CarriersModule,
    AdminDashboardModule,
    CitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
