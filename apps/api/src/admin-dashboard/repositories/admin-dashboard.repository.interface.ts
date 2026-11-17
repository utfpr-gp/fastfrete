export const ADMIN_DASHBOARD_REPOSITORY = Symbol('ADMIN_DASHBOARD_REPOSITORY');

export interface RawPlatformMetrics {
  customers: number;
  carriers: number;
  suspendedUsers: number;
  freightsByStatus: Record<string, number>;
  applicationsByStatus: Record<string, number>;
  reviewsCount: number;
  averageRating: number | null;
}

export interface IAdminDashboardRepository {
  getPlatformMetrics(): Promise<RawPlatformMetrics>;
}
