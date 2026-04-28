import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from './pagination-meta.dto.js';

/**
 * Generic paginated response wrapper.
 * Use with @ApiPaginatedResponse decorator for Swagger documentation.
 *
 * @example
 * ```typescript
 * const response = new PaginatedResponseDto(users, meta);
 * ```
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items for the current page',
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }

  /**
   * Factory method to create a paginated response
   */
  static create<T>(params: {
    data: T[];
    total: number;
    page: number;
    limit: number;
  }): PaginatedResponseDto<T> {
    const meta = new PaginationMetaDto({
      page: params.page,
      limit: params.limit,
      total: params.total,
    });
    return new PaginatedResponseDto(params.data, meta);
  }
}
