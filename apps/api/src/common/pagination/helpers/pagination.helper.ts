import { PAGINATION_DEFAULTS } from '../dto/pagination-query.dto.js';
import {
  PaginationParams,
  PrismaPaginationQuery,
  FilterMode,
  FilterDefinition,
} from '../interfaces/pagination.interface.js';

// Re-export types for convenience
export { FilterMode };
export type { FilterDefinition };

/**
 * Build Prisma skip/take pagination parameters
 *
 * @param params - Pagination parameters (page, limit)
 * @returns Prisma pagination query with skip and take
 *
 * @example
 * ```typescript
 * const pagination = buildPrismaPagination({ page: 2, limit: 10 });
 * // Returns: { skip: 10, take: 10 }
 *
 * const users = await prisma.user.findMany({
 *   ...pagination,
 *   where: { ... }
 * });
 * ```
 */
export function buildPrismaPagination(
  params: PaginationParams,
): PrismaPaginationQuery {
  const page = params.page ?? PAGINATION_DEFAULTS.page;
  const limit = Math.min(
    params.limit ?? PAGINATION_DEFAULTS.limit,
    PAGINATION_DEFAULTS.maxLimit,
  );

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

/**
 * Build a Prisma where clause for a single filter
 *
 * @param definition - Filter definition with field, mode, and value
 * @returns Prisma where condition for the field
 *
 * Note: For MySQL, case sensitivity depends on the column collation.
 * Using `utf8mb4_unicode_ci` (default) makes searches case-insensitive.
 *
 * @example
 * ```typescript
 * const condition = buildFilterCondition({
 *   field: 'name',
 *   mode: FilterMode.CONTAINS,
 *   value: 'john'
 * });
 * // Returns: { name: { contains: 'john' } }
 * ```
 */
export function buildFilterCondition(
  definition: FilterDefinition,
): Record<string, unknown> {
  const { field, mode, value } = definition;

  if (value === undefined || value === null || value === '') {
    return {};
  }

  switch (mode) {
    case FilterMode.EQUALS:
      return { [field]: value };

    case FilterMode.CONTAINS:
      return {
        [field]: {
          contains: value,
        },
      };

    case FilterMode.STARTS_WITH:
      return {
        [field]: {
          startsWith: value,
        },
      };

    case FilterMode.ENDS_WITH:
      return {
        [field]: {
          endsWith: value,
        },
      };

    default:
      return { [field]: value };
  }
}

/**
 * Build a Prisma where clause from multiple filter definitions
 *
 * @param filters - Array of filter definitions
 * @returns Combined Prisma where clause with AND conditions
 *
 * @example
 * ```typescript
 * const where = buildWhereClause([
 *   { field: 'name', mode: FilterMode.CONTAINS, value: 'john' },
 *   { field: 'email', mode: FilterMode.EQUALS, value: 'john@example.com' },
 * ]);
 * // Returns: { AND: [{ name: { contains: 'john' } }, { email: 'john@example.com' }] }
 * ```
 */
export function buildWhereClause(
  filters: FilterDefinition[],
): Record<string, unknown> {
  const conditions = filters
    .map((filter) => buildFilterCondition(filter))
    .filter((condition) => Object.keys(condition).length > 0);

  if (conditions.length === 0) {
    return {};
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  return { AND: conditions };
}
