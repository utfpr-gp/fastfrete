import { ApiProperty } from '@nestjs/swagger';

/**
 * Metadata for paginated responses.
 * Contains information about the current page, total items, etc.
 */
export class PaginationMetaDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean;

  constructor(params: { page: number; limit: number; total: number }) {
    this.page = params.page;
    this.limit = params.limit;
    this.total = params.total;
    this.totalPages = Math.ceil(params.total / params.limit);
    this.hasPreviousPage = params.page > 1;
    this.hasNextPage = params.page < this.totalPages;
  }
}
