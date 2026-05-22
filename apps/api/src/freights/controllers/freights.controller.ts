import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
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
import { FreightsService } from '../freights.service.js';
import { CreateFreightDto } from '../dto/create-freight.dto.js';
import { UpdateFreightDto } from '../dto/update-freight.dto.js';
import { FreightsFilterDto } from '../dto/freights-filter.dto.js';
import { FreightResponseDto } from '../dto/freight-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CUSTOMER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ApiValidationError } from '../../common/swagger/api-validation-error.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';
import { ApiPaginatedResponse } from '../../common/pagination/index.js';
import { PaginatedResponseDto } from '../../common/pagination/index.js';

@ApiTags('Freights')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, FreightResponseDto)
@Controller('freights')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.CUSTOMER)
export class FreightsController {
  constructor(private readonly freightsService: FreightsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_CREATE)
  @ApiAuthorization({
    summary: 'Publicar um novo frete',
    description: 'Cria um novo frete com status OPEN. Somente clientes podem publicar fretes.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_CREATE],
  })
  @ApiResponse({ status: 201, description: 'Frete criado com sucesso', type: FreightResponseDto })
  @ApiValidationError()
  async create(
    @Body() dto: CreateFreightDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightResponseDto> {
    return this.freightsService.create(dto, currentUser.id);
  }

  @Get()
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_LIST)
  @ApiAuthorization({
    summary: 'Listar meus fretes',
    description: 'Retorna a lista paginada dos fretes do cliente autenticado.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_LIST],
  })
  @ApiPaginatedResponse(FreightResponseDto)
  async findAll(
    @Query() filterDto: FreightsFilterDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PaginatedResponseDto<FreightResponseDto>> {
    return this.freightsService.findAllByClient(currentUser.id, filterDto);
  }

  @Get(':id')
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_READ)
  @ApiAuthorization({
    summary: 'Obter um frete por ID',
    description: 'Retorna os detalhes de um frete pertencente ao cliente autenticado.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_READ],
  })
  @ApiResponse({ status: 200, description: 'Frete encontrado', type: FreightResponseDto })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightResponseDto> {
    return this.freightsService.findOneByClient(id, currentUser.id);
  }

  @Patch(':id')
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_UPDATE)
  @ApiAuthorization({
    summary: 'Atualizar um frete',
    description: 'Atualiza os dados de um frete. Permitido apenas quando o status é OPEN.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_UPDATE],
  })
  @ApiResponse({ status: 200, description: 'Frete atualizado com sucesso', type: FreightResponseDto })
  @ApiResponse({ status: 403, description: 'Frete não pode ser editado no status atual' })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  @ApiValidationError()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFreightDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightResponseDto> {
    return this.freightsService.update(id, currentUser.id, dto);
  }

  @Patch(':id/cancel')
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_CANCEL)
  @ApiAuthorization({
    summary: 'Cancelar um frete',
    description: 'Cancela um frete. Permitido quando o status é OPEN ou NEGOTIATING.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_CANCEL],
  })
  @ApiResponse({ status: 200, description: 'Frete cancelado com sucesso', type: FreightResponseDto })
  @ApiResponse({ status: 403, description: 'Frete não pode ser cancelado no status atual' })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightResponseDto> {
    return this.freightsService.cancel(id, currentUser.id);
  }
}
