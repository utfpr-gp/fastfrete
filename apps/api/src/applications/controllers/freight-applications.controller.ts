import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApplicationsService } from '../applications.service.js';
import { CreateApplicationDto } from '../dto/create-application.dto.js';
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

@ApiTags('Freights / Applications')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, ApplicationResponseDto)
@Controller('freights')
@UseGuards(AuthorizationGuard)
export class FreightApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post(':freightId/applications')
  @HttpCode(HttpStatus.CREATED)
  @RoleTypes(RoleTypeEnum.CARRIER)
  @Permissions(CARRIER_PERMISSIONS.APPLICATIONS_CREATE)
  @ApiAuthorization({
    summary: 'Enviar proposta para um frete',
    description:
      'Cria uma proposta de um motorista para executar o frete. Somente motoristas podem enviar propostas.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.APPLICATIONS_CREATE],
  })
  @ApiResponse({
    status: 201,
    description: 'Proposta enviada com sucesso',
    type: ApplicationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Proposta duplicada para este frete',
  })
  @ApiValidationError()
  async create(
    @Param('freightId', ParseUUIDPipe) freightId: string,
    @Body() dto: CreateApplicationDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto> {
    return this.applicationsService.create(freightId, currentUser.id, dto);
  }

  @Get(':freightId/applications')
  @RoleTypes(RoleTypeEnum.CUSTOMER)
  @Permissions(CUSTOMER_PERMISSIONS.APPLICATIONS_LIST)
  @ApiAuthorization({
    summary: 'Listar propostas de um frete',
    description:
      'Retorna todas as propostas recebidas em um frete do cliente autenticado.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.APPLICATIONS_LIST],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de propostas',
    type: [ApplicationResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  async findAllByFreight(
    @Param('freightId', ParseUUIDPipe) freightId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ApplicationResponseDto[]> {
    return this.applicationsService.findAllByFreight(freightId, currentUser.id);
  }
}
