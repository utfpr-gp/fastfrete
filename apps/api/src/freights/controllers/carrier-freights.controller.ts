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
import { FreightsFilterDto } from '../dto/freights-filter.dto.js';
import { FreightResponseDto } from '../dto/freight-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
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
      'Retorna a lista paginada de fretes abertos para fretistas se candidatarem.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.FREIGHTS_LIST],
  })
  @ApiPaginatedResponse(FreightResponseDto)
  async findAllOpen(
    @Query() filterDto: FreightsFilterDto,
  ): Promise<PaginatedResponseDto<FreightResponseDto>> {
    return this.freightsService.findAllOpen(filterDto);
  }

  @Get(':id')
  @Permissions(CARRIER_PERMISSIONS.FREIGHTS_READ)
  @ApiAuthorization({
    summary: 'Obter detalhes de um frete',
    description:
      'Retorna os detalhes de um frete disponível para o fretista visualizar antes de se candidatar.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.FREIGHTS_READ],
  })
  @ApiResponse({
    status: 200,
    description: 'Frete encontrado',
    type: FreightResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FreightResponseDto> {
    return this.freightsService.findOne(id);
  }
}
