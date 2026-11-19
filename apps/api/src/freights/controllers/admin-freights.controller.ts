import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { FreightsService } from '../freights.service.js';
import { AdminFreightsFilterDto } from '../dto/admin-freights-filter.dto.js';
import { AdminFreightResponseDto } from '../dto/admin-freight-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { ADMIN_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/pagination/index.js';

@ApiTags('Admin - Freights')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(AdminFreightResponseDto)
@Controller('admin/freights')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.ADMIN)
export class AdminFreightsController {
  constructor(private readonly freightsService: FreightsService) {}

  @Get()
  @Permissions(ADMIN_PERMISSIONS.FREIGHTS_ADMIN_LIST)
  @ApiAuthorization({
    summary: 'Listar todos os fretes',
    description:
      'Retorna a lista paginada de todos os fretes da plataforma, com cliente e quantidade de candidaturas. Suporta filtros por status, categoria de veículo e busca pelo título.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.FREIGHTS_ADMIN_LIST],
  })
  @ApiPaginatedResponse(AdminFreightResponseDto)
  async findAll(
    @Query() filterDto: AdminFreightsFilterDto,
  ): Promise<PaginatedResponseDto<AdminFreightResponseDto>> {
    return this.freightsService.findAllForAdmin(filterDto);
  }
}
