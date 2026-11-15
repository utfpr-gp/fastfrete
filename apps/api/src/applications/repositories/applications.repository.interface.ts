import {
  Application,
  ApplicationStatus,
} from '../entities/application.entity.js';
import {
  PaginationOptions,
  PaginatedResult,
} from '../../common/pagination/index.js';

export const APPLICATIONS_REPOSITORY = Symbol('APPLICATIONS_REPOSITORY');

export interface CreateApplicationData {
  freightId: string;
  freighterId: string;
  vehicleId: string;
  proposedPrice: string;
  message?: string;
}

export interface UpdateApplicationData {
  proposedPrice?: string;
}

export interface ApplicationsFilters {
  status?: ApplicationStatus;
  freightId?: string;
}

export interface IApplicationsRepository {
  create(data: CreateApplicationData): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findByFreight(freightId: string): Promise<Application[]>;
  findByFreightAndFreighter(
    freightId: string,
    freighterId: string,
  ): Promise<Application | null>;
  findByFreighter(
    freighterId: string,
    filters: ApplicationsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Application>>;
  update(id: string, data: UpdateApplicationData): Promise<Application>;
  updateStatus(id: string, status: ApplicationStatus): Promise<Application>;
  acceptApplication(applicationId: string): Promise<Application>;
  completeApplication(applicationId: string): Promise<Application>;
  validateVehicleOwnership(
    vehicleId: string,
    freighterId: string,
  ): Promise<boolean>;
}
