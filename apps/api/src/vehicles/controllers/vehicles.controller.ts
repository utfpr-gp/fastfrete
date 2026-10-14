import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { VehiclesService } from '../vehicles.service.js';
import { CreateVehicleDto } from '../dto/create-vehicle.dto.js';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto.js';
import { VehiclesFilterDto } from '../dto/vehicles-filter.dto.js';
import { VehicleResponseDto } from '../dto/vehicle-response.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ApiValidationError } from '../../common/swagger/api-validation-error.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';
import {
  ApiPaginatedResponse,
  PaginatedResponseDto,
} from '../../common/pagination/index.js';

@ApiTags('Vehicles')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, VehicleResponseDto)
@Controller('vehicles')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.CARRIER)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(CARRIER_PERMISSIONS.VEHICLES_CREATE)
  @ApiAuthorization({
    summary: 'Cadastrar um novo veículo',
    description:
      'Cria um novo veículo para o fretista autenticado. O veículo é criado com status ativo.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.VEHICLES_CREATE],
  })
  @ApiResponse({
    status: 201,
    description: 'Veículo criado com sucesso',
    type: VehicleResponseDto,
  })
  @ApiValidationError()
  async create(
    @Body() dto: CreateVehicleDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.create(dto, currentUser.id);
  }

  @Get()
  @Permissions(CARRIER_PERMISSIONS.VEHICLES_LIST)
  @ApiAuthorization({
    summary: 'Listar meus veículos',
    description:
      'Retorna a lista paginada dos veículos do fretista autenticado.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.VEHICLES_LIST],
  })
  @ApiPaginatedResponse(VehicleResponseDto)
  async findAll(
    @Query() filterDto: VehiclesFilterDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PaginatedResponseDto<VehicleResponseDto>> {
    return this.vehiclesService.findAllByUser(currentUser.id, filterDto);
  }

  @Get(':id')
  @Permissions(CARRIER_PERMISSIONS.VEHICLES_READ)
  @ApiAuthorization({
    summary: 'Obter um veículo por ID',
    description:
      'Retorna os detalhes de um veículo pertencente ao fretista autenticado.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.VEHICLES_READ],
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo encontrado',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.findOneByUser(id, currentUser.id);
  }

  @Patch(':id')
  @Permissions(CARRIER_PERMISSIONS.VEHICLES_UPDATE)
  @ApiAuthorization({
    summary: 'Atualizar um veículo',
    description:
      'Atualiza os dados de um veículo. Permite alterar modelo, placa, capacidade, cor e status ativo.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.VEHICLES_UPDATE],
  })
  @ApiResponse({
    status: 200,
    description: 'Veículo atualizado com sucesso',
    type: VehicleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  @ApiValidationError()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<VehicleResponseDto> {
    return this.vehiclesService.update(id, currentUser.id, dto);
  }

  @Delete(':id')
  @Permissions(CARRIER_PERMISSIONS.VEHICLES_DELETE)
  @ApiAuthorization({
    summary: 'Remover um veículo',
    description:
      'Remove permanentemente um veículo do fretista autenticado.',
    roleTypes: [RoleTypeEnum.CARRIER],
    permissions: [CARRIER_PERMISSIONS.VEHICLES_DELETE],
  })
  @ApiResponse({ status: 204, description: 'Veículo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<void> {
    return this.vehiclesService.remove(id, currentUser.id);
  }
}
