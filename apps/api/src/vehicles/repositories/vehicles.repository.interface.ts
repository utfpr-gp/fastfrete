import { Vehicle } from '../entities/vehicle.entity.js';
import { PaginationOptions, PaginatedResult } from '../../common/pagination/index.js';

export const VEHICLES_REPOSITORY = Symbol('VEHICLES_REPOSITORY');

export interface CreateVehicleData {
  userId: string;
  vehicleCategoryId: string;
  model: string;
  plate?: string | null;
  capacityKg: string;
  color?: string | null;
}

export interface UpdateVehicleData {
  vehicleCategoryId?: string;
  model?: string;
  plate?: string | null;
  capacityKg?: string;
  color?: string | null;
  active?: boolean;
}

export interface VehiclesFilters {
  vehicleCategoryId?: string;
  active?: boolean;
}

export interface IVehiclesRepository {
  create(data: CreateVehicleData): Promise<Vehicle>;
  findAllByUser(
    userId: string,
    filters: VehiclesFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Vehicle>>;
  findById(id: string): Promise<Vehicle | null>;
  findByIdAndUser(id: string, userId: string): Promise<Vehicle | null>;
  update(id: string, data: UpdateVehicleData): Promise<Vehicle>;
  delete(id: string): Promise<void>;
  findByFreighter(
    freighterId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Vehicle>>;
}
