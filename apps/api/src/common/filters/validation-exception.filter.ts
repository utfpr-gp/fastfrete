import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: Record<string, string[]>;
  timestamp: string;
  path: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const responseObj = exceptionResponse as {
        message: unknown;
        error?: string;
      };
      const messages = responseObj.message;

      if (Array.isArray(messages) && messages.length > 0) {
        const errors = this.formatValidationErrors(messages);

        const errorResponse: ValidationErrorResponse = {
          statusCode: status,
          message: 'Erro de validação',
          errors,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        response.status(status).json(errorResponse);
        return;
      }
    }

    let message = 'Requisição inválida';
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const msgValue = (exceptionResponse as { message: unknown }).message;
      if (typeof msgValue === 'string') {
        message = msgValue;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private formatValidationErrors(errors: unknown[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    for (const error of errors) {
      if (typeof error === 'string') {
        const field = this.extractFieldFromMessage(error);
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }
        formattedErrors[field].push(error);
        continue;
      }

      if (typeof error === 'object' && error !== null && 'property' in error) {
        const validationError = error as {
          property: string;
          constraints?: Record<string, string>;
          children?: unknown[];
        };
        this.extractConstraints(validationError, formattedErrors);
      }
    }

    return formattedErrors;
  }

  private extractConstraints(
    error: {
      property: string;
      constraints?: Record<string, string>;
      children?: unknown[];
    },
    formattedErrors: Record<string, string[]>,
    parentPath = '',
  ): void {
    const path = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      if (!formattedErrors[path]) {
        formattedErrors[path] = [];
      }
      formattedErrors[path].push(...Object.values(error.constraints));
    }

    if (
      error.children &&
      Array.isArray(error.children) &&
      error.children.length > 0
    ) {
      for (const child of error.children) {
        if (
          typeof child === 'object' &&
          child !== null &&
          'property' in child
        ) {
          this.extractConstraints(
            child as {
              property: string;
              constraints?: Record<string, string>;
              children?: unknown[];
            },
            formattedErrors,
            path,
          );
        }
      }
    }
  }

  private extractFieldFromMessage(message: string): string {
    const patterns = [
      /^O\s+(\w+)\s/i,
      /^A\s+(\w+)\s/i,
      /^(\w+)\s+é\s+obrigatóri/i,
      /^(\w+)\s+deve/i,
      /campo\s+(\w+)/i,
      /propriedade\s+(\w+)/i,
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        const fieldMap: Record<string, string> = {
          email: 'email',
          senha: 'password',
          nome: 'name',
          telefone: 'phoneNumber',
          tipo: 'roleType',
        };
        const word = match[1].toLowerCase();
        return fieldMap[word] || word;
      }
    }

    return 'general';
  }
}
