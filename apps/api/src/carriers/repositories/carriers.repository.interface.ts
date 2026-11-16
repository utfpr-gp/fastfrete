import type { Carrier } from '../entities/carrier.entity.js';
import {
  PaginationOptions,
  PaginatedResult,
} from '../../common/pagination/index.js';

export const CARRIERS_REPOSITORY = Symbol('CARRIERS_REPOSITORY');

export interface CarriersFilters {
  vehicleCategory?: string;
}

export interface ICarriersRepository {
  findCarriersWithVehicles(
    filters: CarriersFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Carrier>>;
}
