import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { FreightsService } from '../freights.service.js';
import { CarrierFreightsFilterDto } from '../dto/carrier-freights-filter.dto.js';
import { FreightResponseDto } from '../dto/freight-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/pagination/index.js';

@ApiTags('Carrier Freights')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(FreightResponseDto)
@Controller('carrier/freights')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.CARRIER)
export class CarrierFreightsController {
  constructor(private readonly freightsService: FreightsService) {}

  @Get()
  @Permissions(CARRIER_PERMISSIONS.FREIGHTS_LIST)
  @ApiAuthorization({
    summary: 'Listar fretes disponíveis',
    description:
      'Retorna a lista paginada de fretes abertos para fretistas se candidatarem. Suporta filtro por categoria, cidade de origem e compatibilidade com os veículos ativos do fretista (compatibleOnly).',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.FREIGHTS_LIST],
  })
  @ApiPaginatedResponse(FreightResponseDto)
  async findAllOpen(
    @Query() filterDto: CarrierFreightsFilterDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PaginatedResponseDto<FreightResponseDto>> {
    return this.freightsService.findAllOpen(filterDto, currentUser.id);
  }

  @Get(':id')
  @Permissions(CARRIER_PERMISSIONS.FREIGHTS_READ)
  @ApiAuthorization({
    summary: 'Obter detalhes de um frete',
    description:
      'Retorna os detalhes de um frete. Fretes OPEN são acessíveis a qualquer fretista. Fretes não-OPEN só são acessíveis se o fretista tiver candidatura ativa.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.FREIGHTS_READ],
  })
  @ApiResponse({
    status: 200,
    description: 'Frete encontrado',
    type: FreightResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado ou não está disponível' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightResponseDto> {
    return this.freightsService.findOneForCarrier(id, currentUser.id);
  }
}
