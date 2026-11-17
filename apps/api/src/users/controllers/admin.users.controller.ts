import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UsersService } from '../users.service.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { SuspendUserDto } from '../dto/suspend-user.dto.js';
import { UsersFilterDto } from '../dto/users-filter.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ADMIN_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ApiValidationError } from '../../common/swagger/api-validation-error.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';
import {
  PaginatedResponseDto,
  ApiPaginatedResponse,
} from '../../common/pagination/index.js';

@ApiTags('Admin - Users')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto)
@Controller('admin/users')
@UseGuards(AuthorizationGuard)
@RoleTypes(RoleTypeEnum.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(ADMIN_PERMISSIONS.USERS_CREATE)
  @ApiAuthorization({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo usuário no sistema com uma role atribuída automaticamente baseada no roleType informado (ADMIN, CUSTOMER ou CARRIER). A senha é automaticamente criptografada.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_CREATE],
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado no sistema',
  })
  @ApiValidationError()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return UserMapper.toResponse(user);
  }

  @Get()
  @Permissions(ADMIN_PERMISSIONS.USERS_LIST)
  @ApiAuthorization({
    summary: 'Listar usuários com paginação e filtros',
    description:
      'Retorna a lista paginada de usuários do sistema com suas roles e permissões. ' +
      'Suporta filtros por nome (busca parcial), email (busca exata) e status.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_LIST],
  })
  @ApiPaginatedResponse(UserResponseDto)
  async findAll(
    @Query() filterDto: UsersFilterDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.usersService.findAllPaginated(filterDto);
  }

  @Get(':id')
  @Permissions(ADMIN_PERMISSIONS.USERS_READ)
  @ApiAuthorization({
    summary: 'Buscar usuário por ID',
    description:
      'Retorna os dados completos de um usuário específico, incluindo suas roles e permissões.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_READ],
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(id);
    return UserMapper.toResponse(user);
  }

  @Patch(':id')
  @Permissions(ADMIN_PERMISSIONS.USERS_UPDATE)
  @ApiAuthorization({
    summary: 'Atualizar usuário',
    description:
      'Atualiza os dados de um usuário existente. Todos os campos são opcionais. Se a senha for alterada, será automaticamente criptografada.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_UPDATE],
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já está em uso por outro usuário',
  })
  @ApiValidationError()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return UserMapper.toResponse(user);
  }

  @Patch(':id/suspend')
  @Permissions(ADMIN_PERMISSIONS.USERS_UPDATE)
  @ApiAuthorization({
    summary: 'Suspender usuário',
    description:
      'Suspende um usuário do sistema, impedindo seu acesso. Requer um motivo para a suspensão. Admin não pode suspender a si mesmo.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_UPDATE],
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário a ser suspenso',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário suspenso com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Admin tentando suspender a si mesmo',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já está suspenso',
  })
  @ApiValidationError()
  async suspend(
    @Param('id') id: string,
    @Body() suspendUserDto: SuspendUserDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.suspend(
      id,
      suspendUserDto.reason,
      currentUser.id,
    );
    return UserMapper.toResponse(user);
  }

  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.OK)
  @Permissions(ADMIN_PERMISSIONS.USERS_UPDATE)
  @ApiAuthorization({
    summary: 'Reativar usuário',
    description:
      'Reativa um usuário suspenso, restaurando seu acesso ao sistema. Remove o motivo de suspensão.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_UPDATE],
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário a ser reativado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário reativado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já está ativo',
  })
  async reactivate(
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.reactivate(id);
    return UserMapper.toResponse(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(ADMIN_PERMISSIONS.USERS_DELETE)
  @ApiAuthorization({
    summary: 'Remover usuário',
    description:
      'Remove permanentemente um usuário do sistema. Esta ação não pode ser desfeita.',
    roleTypes: [RoleTypeEnum.ADMIN],
    permissions: [ADMIN_PERMISSIONS.USERS_DELETE],
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
