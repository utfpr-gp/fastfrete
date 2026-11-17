import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AdminDashboardService } from '../admin-dashboard.service.js';
import { AdminMetricsResponseDto } from '../dto/admin-metrics-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { ADMIN_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';

@ApiTags('Admin - Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('admin/dashboard')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.ADMIN)
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('metrics')
  @Permissions(ADMIN_PERMISSIONS.DASHBOARD_READ)
  @ApiAuthorization({
    summary: 'Obter métricas gerais da plataforma',
    description:
      'Retorna contagens de usuários, fretes por status, candidaturas por status e resumo das avaliações.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.DASHBOARD_READ],
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso',
    type: AdminMetricsResponseDto,
  })
  async getMetrics(): Promise<AdminMetricsResponseDto> {
    return this.dashboardService.getMetrics();
  }
}
