import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { ValidationErrorResponseDto } from './validation-error-response.dto';

export function ApiValidationError() {
  return applyDecorators(
    ApiExtraModels(ValidationErrorResponseDto),
    ApiResponse({
      status: 400,
      description: 'Erro de validação - Campos inválidos ou ausentes',
      schema: {
        $ref: getSchemaPath(ValidationErrorResponseDto),
      },
    }),
  );
}
