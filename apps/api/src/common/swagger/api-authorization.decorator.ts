import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition';

export interface ApiAuthorizationOptions {
  summary: string;
  description?: string;
  roleTypes?: RoleTypeEnum[];
  permissions?: string[];
  isPublic?: boolean;
}

export function ApiAuthorization(options: ApiAuthorizationOptions) {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] =
    [];

  let fullDescription = options.description || '';

  if (options.isPublic) {
    fullDescription += '\n\n🔓 **Acesso:** Público (não requer autenticação)';
  } else {
    fullDescription += '\n\n🔐 **Acesso:** Autenticado';

    if (options.roleTypes?.length) {
      fullDescription += `\n\n👥 **Role Types permitidos:** \`${options.roleTypes.join('`, `')}\``;
    }

    if (options.permissions?.length) {
      fullDescription += `\n\n🔑 **Permissions necessárias (uma das):** \`${options.permissions.join('`, `')}\``;
    }
  }

  decorators.push(
    ApiOperation({
      summary: options.summary,
      description: fullDescription.trim(),
    }),
  );

  if (!options.isPublic) {
    decorators.push(
      ApiResponse({
        status: 401,
        description: 'Não autenticado - Token JWT inválido ou ausente',
      }),
    );

    decorators.push(
      ApiResponse({
        status: 403,
        description:
          'Não autorizado - Usuário não possui role-type ou permission necessária',
      }),
    );
  }

  return applyDecorators(...decorators);
}
