import { Freight, FreightStatus, FreightDateMode } from '../entities/freight.entity.js';
import { PaginationOptions, PaginatedResult } from '../../common/pagination/index.js';
import { FreightOrderBy } from '../dto/freights-filter.dto.js';

export const FREIGHTS_REPOSITORY = Symbol('FREIGHTS_REPOSITORY');

export interface CreateFreightData {
  clientId: string;
  title: string;
  description: string;
  vehicleCategory: string;
  originCityId: string;
  originDistrict: string;
  originStreet: string;
  originNumber: string;
  destinationCityId: string;
  destinationDistrict: string;
  destinationStreet: string;
  destinationNumber: string;
  dateMode: FreightDateMode;
  exactDatetime?: Date | null;
  availabilityWindow?: string | null;
}

export interface UpdateFreightData {
  title?: string;
  description?: string;
  vehicleCategory?: string;
  originCityId?: string;
  originDistrict?: string;
  originStreet?: string;
  originNumber?: string;
  destinationCityId?: string;
  destinationDistrict?: string;
  destinationStreet?: string;
  destinationNumber?: string;
  dateMode?: FreightDateMode;
  exactDatetime?: Date | null;
  availabilityWindow?: string | null;
}

export interface FreightsFilters {
  status?: FreightStatus;
  vehicleCategory?: string;
  orderBy?: FreightOrderBy;
}

export interface IFreightsRepository {
  create(data: CreateFreightData): Promise<Freight>;
  findAllByClient(
    clientId: string,
    filters: FreightsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Freight>>;
  findAllOpen(
    filters: FreightsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Freight>>;
  findById(id: string): Promise<Freight | null>;
  findOpenById(id: string): Promise<Freight | null>;
  findByIdAndClient(id: string, clientId: string): Promise<Freight | null>;
  update(id: string, data: UpdateFreightData): Promise<Freight>;
  updateStatus(id: string, status: FreightStatus): Promise<Freight>;
}
