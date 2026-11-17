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
  suggestedPrice?: number | null;
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
  suggestedPrice?: number | null;
}

export interface FreightsFilters {
  status?: FreightStatus;
  vehicleCategory?: string;
  vehicleCategories?: string[];
  cityId?: string;
  orderBy?: FreightOrderBy;
}

export interface AdminFreightsFilters extends FreightsFilters {
  search?: string;
}

export interface AdminFreightRow {
  freight: Freight;
  clientName: string;
  applicationsCount: number;
}

export interface ClientSummary {
  name: string;
  averageRating: number;
  totalReviews: number;
  completedFreights: number;
  phoneNumber: string;
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
  getClientSummary(clientId: string): Promise<ClientSummary | null>;
  cancelWithPendingApplications(id: string): Promise<Freight | null>;
  findActiveVehicleCategoryNames(userId: string): Promise<string[]>;
  findAllForAdmin(
    filters: AdminFreightsFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<AdminFreightRow>>;
}
