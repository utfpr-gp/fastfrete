import { Inject, Injectable } from '@nestjs/common';
import type { IAdminDashboardRepository } from './repositories/admin-dashboard.repository.interface.js';
import { ADMIN_DASHBOARD_REPOSITORY } from './repositories/admin-dashboard.repository.interface.js';
import { AdminMetricsResponseDto } from './dto/admin-metrics-response.dto.js';

@Injectable()
export class AdminDashboardService {
  constructor(
    @Inject(ADMIN_DASHBOARD_REPOSITORY)
    private readonly repository: IAdminDashboardRepository,
  ) {}

  async getMetrics(): Promise<AdminMetricsResponseDto> {
    const raw = await this.repository.getPlatformMetrics();

    const freight = (status: string) => raw.freightsByStatus[status] ?? 0;
    const application = (status: string) =>
      raw.applicationsByStatus[status] ?? 0;
    const sum = (counts: Record<string, number>) =>
      Object.values(counts).reduce((total, value) => total + value, 0);

    return {
      users: {
        total: raw.customers + raw.carriers,
        customers: raw.customers,
        carriers: raw.carriers,
        suspended: raw.suspendedUsers,
      },
      freights: {
        total: sum(raw.freightsByStatus),
        open: freight('OPEN'),
        negotiating: freight('NEGOTIATING'),
        inProgress: freight('IN_PROGRESS'),
        completed: freight('COMPLETED'),
        cancelled: freight('CANCELLED'),
      },
      applications: {
        total: sum(raw.applicationsByStatus),
        pending: application('PENDING'),
        accepted: application('ACCEPTED'),
        rejected: application('REJECTED'),
        withdrawn: application('WITHDRAWN'),
        completed: application('COMPLETED'),
      },
      reviews: {
        total: raw.reviewsCount,
        averageRating:
          raw.averageRating === null
            ? 0
            : Math.round(raw.averageRating * 10) / 10,
      },
    };
  }
}
