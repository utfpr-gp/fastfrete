import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardService } from './admin-dashboard.service';
import {
  ADMIN_DASHBOARD_REPOSITORY,
  RawPlatformMetrics,
} from './repositories/admin-dashboard.repository.interface';

const rawMetrics = (
  overrides: Partial<RawPlatformMetrics> = {},
): RawPlatformMetrics => ({
  customers: 10,
  carriers: 4,
  suspendedUsers: 1,
  freightsByStatus: { OPEN: 3, COMPLETED: 5, CANCELLED: 2 },
  applicationsByStatus: { PENDING: 4, ACCEPTED: 1 },
  reviewsCount: 6,
  averageRating: 4.333,
  ...overrides,
});

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;
  let repository: { getPlatformMetrics: jest.Mock };

  beforeEach(async () => {
    repository = { getPlatformMetrics: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminDashboardService,
        { provide: ADMIN_DASHBOARD_REPOSITORY, useValue: repository },
      ],
    }).compile();

    service = module.get(AdminDashboardService);
  });

  it('sums customers and carriers as the user total', async () => {
    repository.getPlatformMetrics.mockResolvedValue(rawMetrics());

    const result = await service.getMetrics();

    expect(result.users).toEqual({
      total: 14,
      customers: 10,
      carriers: 4,
      suspended: 1,
    });
  });

  it('fills missing statuses with zero and totals the freights', async () => {
    repository.getPlatformMetrics.mockResolvedValue(rawMetrics());

    const result = await service.getMetrics();

    expect(result.freights).toEqual({
      total: 10,
      open: 3,
      negotiating: 0,
      inProgress: 0,
      completed: 5,
      cancelled: 2,
    });
  });

  it('totals the applications by status', async () => {
    repository.getPlatformMetrics.mockResolvedValue(rawMetrics());

    const result = await service.getMetrics();

    expect(result.applications).toEqual({
      total: 5,
      pending: 4,
      accepted: 1,
      rejected: 0,
      withdrawn: 0,
      completed: 0,
    });
  });

  it('rounds the average rating to one decimal place', async () => {
    repository.getPlatformMetrics.mockResolvedValue(rawMetrics());

    const result = await service.getMetrics();

    expect(result.reviews).toEqual({ total: 6, averageRating: 4.3 });
  });

  it('returns zeroes when the platform has no data', async () => {
    repository.getPlatformMetrics.mockResolvedValue(
      rawMetrics({
        customers: 0,
        carriers: 0,
        suspendedUsers: 0,
        freightsByStatus: {},
        applicationsByStatus: {},
        reviewsCount: 0,
        averageRating: null,
      }),
    );

    const result = await service.getMetrics();

    expect(result.users.total).toBe(0);
    expect(result.freights.total).toBe(0);
    expect(result.applications.total).toBe(0);
    expect(result.reviews).toEqual({ total: 0, averageRating: 0 });
  });
});
