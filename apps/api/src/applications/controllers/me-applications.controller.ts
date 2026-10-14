import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApplicationsService } from '../applications.service.js';
import { ApplicationsFilterDto } from '../dto/applications-filter.dto.js';
import { ApplicationResponseDto } from '../dto/application-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/pagination/index.js';

@ApiTags('Me')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, ApplicationResponseDto)
@Controller('me')
@UseGuards(AuthorizationGuard)
export class MeApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('applications')
  @RoleTypes(RoleTypeEnum.CARRIER)
  @Permissions(CARRIER_PERMISSIONS.APPLICATIONS_LIST)
  @ApiAuthorization({
    summary: 'Listar minhas propostas',
    description:
      'Retorna a lista paginada das propostas enviadas pelo motorista autenticado. Suporta filtros por status e freightId.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.APPLICATIONS_LIST],
  })
  @ApiPaginatedResponse(ApplicationResponseDto)
  @ApiResponse({ status: 200, description: 'Lista paginada de propostas' })
  async findAll(
    @Query() filterDto: ApplicationsFilterDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PaginatedResponseDto<ApplicationResponseDto>> {
    return this.applicationsService.findAllByFreighter(
      currentUser.id,
      filterDto,
    );
  }
}
