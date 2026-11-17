import { User, UserStatus } from '../entities/user.entity.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import {
  PaginationOptions,
  PaginatedResult,
} from '../../common/pagination/index.js';

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');

/**
 * Data required to create a user (without roleType, which is handled separately)
 */
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  cityId: string;
}

/**
 * Data required to update a user
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  status?: UserStatus;
  suspensionReason?: string | null;
}

/**
 * Filters for querying users
 */
export interface UsersFilters {
  name?: string;
  email?: string;
  status?: UserStatus;
}

export interface PublicProfileVehicle {
  id: string;
  vehicleCategoryName: string;
  model: string;
  capacityKg: number;
}

export interface PublicProfileData {
  id: string;
  name: string;
  status: UserStatus;
  roleType: RoleTypeEnum.CUSTOMER | RoleTypeEnum.CARRIER;
  cityName: string;
  memberSince: Date;
  averageRating: number;
  totalReviews: number;
  completedFreights: number;
  vehicles: PublicProfileVehicle[];
}

export interface IUsersRepository {
  /**
   * Create a user with an assigned role
   */
  create(data: CreateUserData, roleType: RoleTypeEnum): Promise<User>;

  /**
   * Find all users (no pagination)
   */
  findAll(): Promise<User[]>;

  /**
   * Find users with pagination and filters
   */
  findAllPaginated(
    filters: UsersFilters,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<User>>;

  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<User>;
  getPublicProfile(
    id: string,
    includeSuspended?: boolean,
  ): Promise<PublicProfileData | null>;
}
