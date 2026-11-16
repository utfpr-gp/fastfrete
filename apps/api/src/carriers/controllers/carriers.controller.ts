import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { CarriersService } from '../carriers.service.js';
import { CarriersFilterDto } from '../dto/carriers-filter.dto.js';
import { CarrierResponseDto } from '../dto/carrier-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CUSTOMER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/pagination/index.js';

@ApiTags('Carriers')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(CarrierResponseDto)
@Controller('carriers')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.CUSTOMER)
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Get()
  @Permissions(CUSTOMER_PERMISSIONS.CARRIERS_LIST)
  @ApiAuthorization({
    summary: 'Listar fretistas disponíveis',
    description:
      'Retorna a lista paginada de fretistas com seus veículos e estatísticas de avaliação. ' +
      'Permite filtro por categoria de veículo. Acessível apenas para clientes.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.CARRIERS_LIST],
  })
  @ApiPaginatedResponse(CarrierResponseDto)
  async findAll(
    @Query() filterDto: CarriersFilterDto,
  ): Promise<PaginatedResponseDto<CarrierResponseDto>> {
    return this.carriersService.findAll(filterDto);
  }
}
