import { Module } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service.js';
import { AdminDashboardController } from './controllers/admin-dashboard.controller.js';
import { ADMIN_DASHBOARD_REPOSITORY } from './repositories/admin-dashboard.repository.interface.js';
import { AdminDashboardRepository } from './repositories/admin-dashboard.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AdminDashboardController],
  providers: [
    AdminDashboardService,
    {
      provide: ADMIN_DASHBOARD_REPOSITORY,
      useClass: AdminDashboardRepository,
    },
  ],
})
export class AdminDashboardModule {}
