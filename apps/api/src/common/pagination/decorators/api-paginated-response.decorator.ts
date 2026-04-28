import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../dto/paginated-response.dto.js';
import { PaginationMetaDto } from '../dto/pagination-meta.dto.js';

/**
 * Swagger decorator for paginated responses.
 * Automatically documents the response structure with proper typing.
 *
 * @param dataDto - The DTO class for items in the data array
 * @returns Combined decorators for Swagger documentation
 *
 * @example
 * ```typescript
 * @Get()
 * @ApiPaginatedResponse(UserResponseDto)
 * async findAll(): Promise<PaginatedResponseDto<UserResponseDto>> {
 *   // ...
 * }
 * ```
 */
export function ApiPaginatedResponse<TModel extends Type>(dataDto: TModel) {
  return applyDecorators(
    ApiExtraModels(PaginatedResponseDto, PaginationMetaDto, dataDto),
    ApiOkResponse({
      description: 'Paginated list of items',
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
              meta: {
                $ref: getSchemaPath(PaginationMetaDto),
              },
            },
          },
        ],
      },
    }),
  );
}
