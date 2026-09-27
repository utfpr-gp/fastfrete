import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApplicationsService } from '../applications.service.js';
import { UpdateApplicationDto } from '../dto/update-application.dto.js';
import { ApplicationResponseDto } from '../dto/application-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CUSTOMER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ApiValidationError } from '../../common/swagger/api-validation-error.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, ApplicationResponseDto)
@Controller('applications')
@UseGuards(AuthorizationGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get(':id')
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER)
  @Permissions(
    CUSTOMER_PERMISSIONS.APPLICATIONS_READ,
    CARRIER_PERMISSIONS.APPLICATIONS_READ,
  )
  @ApiAuthorization({
    summary: 'Buscar proposta por ID',
    description:
      'Retorna uma proposta específica. Permitido para o motorista autor da proposta ou o cliente dono do frete.',
    roleTypes: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER],
    permissions: [
      CUSTOMER_PERMISSIONS.APPLICATIONS_READ,
      CARRIER_PERMISSIONS.APPLICATIONS_READ,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta encontrada',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.findOne(id, currentUser.id);
  }

  @Patch(':id')
  @RoleTypes(RoleTypeEnum.CARRIER)
  @Permissions(CARRIER_PERMISSIONS.APPLICATIONS_UPDATE)
  @ApiAuthorization({
    summary: 'Atualizar valor da proposta',
    description:
      'Atualiza o valor proposto. Somente o autor da proposta pode editar. Permitido apenas quando status é PENDING.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.APPLICATIONS_UPDATE],
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta atualizada com sucesso',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada' })
  @ApiValidationError()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.update(id, currentUser.id, dto);
  }

  @Patch(':id/withdraw')
  @RoleTypes(RoleTypeEnum.CARRIER)
  @Permissions(CARRIER_PERMISSIONS.APPLICATIONS_WITHDRAW)
  @ApiAuthorization({
    summary: 'Cancelar proposta',
    description:
      'Cancela a proposta (status → WITHDRAWN). Somente o autor. Permitido apenas quando status é PENDING.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.APPLICATIONS_WITHDRAW],
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta cancelada com sucesso',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada' })
  async withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.withdraw(id, currentUser.id);
  }

  @Patch(':id/accept')
  @RoleTypes(RoleTypeEnum.CUSTOMER)
  @Permissions(CUSTOMER_PERMISSIONS.APPLICATIONS_ACCEPT)
  @ApiAuthorization({
    summary: 'Aceitar proposta',
    description:
      'Aceita a proposta escolhida. As demais propostas do frete são rejeitadas automaticamente e o frete passa a IN_PROGRESS. Somente o dono do frete.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.APPLICATIONS_ACCEPT],
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta aceita com sucesso',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta ou frete não encontrado' })
  async accept(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.accept(id, currentUser.id);
  }

  @Patch(':id/reject')
  @RoleTypes(RoleTypeEnum.CUSTOMER)
  @Permissions(CUSTOMER_PERMISSIONS.APPLICATIONS_REJECT)
  @ApiAuthorization({
    summary: 'Rejeitar proposta',
    description:
      'Rejeita uma proposta (status → REJECTED). Somente o dono do frete. Permitido apenas quando status é PENDING.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.APPLICATIONS_REJECT],
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta rejeitada com sucesso',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta ou frete não encontrado' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.reject(id, currentUser.id);
  }

  @Patch(':id/complete')
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER)
  @Permissions(
    CUSTOMER_PERMISSIONS.APPLICATIONS_COMPLETE,
    CARRIER_PERMISSIONS.APPLICATIONS_COMPLETE,
  )
  @ApiAuthorization({
    summary: 'Finalizar frete',
    description:
      'Marca a proposta e o frete como COMPLETED. Permitido para o motorista ou o cliente dono do frete. Somente quando status é ACCEPTED.',
    roleTypes: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER],
    permissions: [
      CUSTOMER_PERMISSIONS.APPLICATIONS_COMPLETE,
      CARRIER_PERMISSIONS.APPLICATIONS_COMPLETE,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Frete finalizado com sucesso',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta ou frete não encontrado' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.complete(id, currentUser.id);
  }
}
