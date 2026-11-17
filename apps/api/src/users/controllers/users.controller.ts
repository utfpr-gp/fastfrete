import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UsersService } from '../users.service.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { PublicProfileResponseDto } from '../dto/public-profile-response.dto.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CUSTOMER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ApiValidationError } from '../../common/swagger/api-validation-error.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto)
@Controller('users')
@UseGuards(AuthorizationGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Permissions(
    CUSTOMER_PERMISSIONS.PROFILE_READ,
    CARRIER_PERMISSIONS.PROFILE_READ,
  )
  @ApiAuthorization({
    summary: 'Obter perfil do usuário logado',
    description:
      'Retorna os dados do perfil do usuário autenticado, incluindo suas roles e permissões.',
    roleTypes: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER],
    permissions: [
      CUSTOMER_PERMISSIONS.PROFILE_READ,
      CARRIER_PERMISSIONS.PROFILE_READ,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil retornado com sucesso',
    type: UserResponseDto,
  })
  async getProfile(
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(currentUser.id);
    return UserMapper.toResponse(user);
  }

  @Patch('profile')
  @Permissions(
    CUSTOMER_PERMISSIONS.PROFILE_UPDATE,
    CARRIER_PERMISSIONS.PROFILE_UPDATE,
  )
  @ApiAuthorization({
    summary: 'Atualizar perfil do usuário logado',
    description:
      'Permite que o usuário autenticado atualize seus próprios dados de perfil. Todos os campos são opcionais.',
    roleTypes: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER],
    permissions: [
      CUSTOMER_PERMISSIONS.PROFILE_UPDATE,
      CARRIER_PERMISSIONS.PROFILE_UPDATE,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso por outro usuário',
  })
  @ApiValidationError()
  async updateProfile(
    @CurrentUser() currentUser: CurrentUserData,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(currentUser.id, updateUserDto);
    return UserMapper.toResponse(user);
  }

  @Get(':id/public-profile')
  // Perfil público: liberado pelos três tipos de papel, sem permissão específica
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER, RoleTypeEnum.ADMIN)
  @ApiAuthorization({
    summary: 'Obter perfil público de um usuário',
    description:
      'Retorna dados públicos de um cliente ou fretista ativo: nome (abreviado para clientes), cidade, estatísticas de avaliação e, para fretistas, veículos ativos. Não expõe e-mail nem telefone. Administradores também podem consultar usuários suspensos.',
    roleTypes: [
      RoleTypeEnum.CUSTOMER,
      RoleTypeEnum.CARRIER,
      RoleTypeEnum.ADMIN,
    ],
    permissions: [
      CUSTOMER_PERMISSIONS.PROFILE_READ,
      CARRIER_PERMISSIONS.PROFILE_READ,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil público retornado com sucesso',
    type: PublicProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  async getPublicProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<PublicProfileResponseDto> {
    const isAdmin = currentUser.roleTypes.includes(RoleTypeEnum.ADMIN);
    return this.usersService.getPublicProfile(id, isAdmin);
  }
}
