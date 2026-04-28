/**
 * Pagination options for repository queries
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Generic paginated result from repository
 * @template T - The type of items in the data array
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

/**
 * Parameters for building a Prisma pagination query
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Prisma pagination query options (skip/take)
 */
export interface PrismaPaginationQuery {
  skip: number;
  take: number;
}

/**
 * Filter mode types for building Prisma where clauses
 */
export enum FilterMode {
  /** Exact match (equals) */
  EQUALS = 'equals',
  /** Partial match, case insensitive (contains) */
  CONTAINS = 'contains',
  /** Starts with, case insensitive */
  STARTS_WITH = 'startsWith',
  /** Ends with, case insensitive */
  ENDS_WITH = 'endsWith',
}

/**
 * Filter definition for a field
 */
export interface FilterDefinition {
  field: string;
  mode: FilterMode;
  value: unknown;
}
