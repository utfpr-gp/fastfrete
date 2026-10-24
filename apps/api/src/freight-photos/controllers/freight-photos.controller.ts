import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FreightPhotosService } from '../freight-photos.service.js';
import { FreightPhotoResponseDto } from '../dto/freight-photo-response.dto.js';
import { FileValidationPipe } from '../pipes/file-validation.pipe.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { CurrentUser } from '../../authorization/decorators/current-user.decorator.js';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator.js';
import { CUSTOMER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { ADMIN_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';

@ApiTags('Freights / Photos')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, FreightPhotoResponseDto)
@Controller('freights')
@UseGuards(AuthorizationGuard)
export class FreightPhotosController {
  constructor(private readonly photosService: FreightPhotosService) {}

  @Post(':freightId/photos')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @RoleTypes(RoleTypeEnum.CUSTOMER)
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_UPDATE)
  @ApiAuthorization({
    summary: 'Upload de foto do frete',
    description:
      'Adiciona uma foto ao frete (máximo 3 por frete). Formatos aceitos: JPG, PNG, GIF, WEBP. Apenas o dono do frete pode adicionar fotos.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_UPDATE],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Foto adicionada com sucesso',
    type: FreightPhotoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é o dono do frete',
  })
  @ApiResponse({
    status: 400,
    description: 'Limite de fotos atingido ou formato inválido',
  })
  async upload(
    @Param('freightId', ParseUUIDPipe) freightId: string,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightPhotoResponseDto> {
    return this.photosService.upload(freightId, currentUser.id, file);
  }

  @Get(':freightId/photos')
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER, RoleTypeEnum.ADMIN)
  @Permissions(
    CUSTOMER_PERMISSIONS.FREIGHTS_READ,
    CARRIER_PERMISSIONS.APPLICATIONS_READ,
    ADMIN_PERMISSIONS.REVIEWS_READ,
  )
  @ApiAuthorization({
    summary: 'Listar fotos do frete',
    description:
      'Retorna todas as fotos de um frete específico, ordenadas. Apenas o dono do frete, candidatas ao frete ou administradores podem visualizar.',
    roleTypes: [
      RoleTypeEnum.CUSTOMER,
      RoleTypeEnum.CARRIER,
      RoleTypeEnum.ADMIN,
    ],
    permissions: [
      CUSTOMER_PERMISSIONS.FREIGHTS_READ,
      CARRIER_PERMISSIONS.APPLICATIONS_READ,
      ADMIN_PERMISSIONS.REVIEWS_READ,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fotos',
    type: [FreightPhotoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  @ApiResponse({
    status: 403,
    description: 'Usuário não tem permissão para ver este frete',
  })
  async findByFreight(
    @Param('freightId', ParseUUIDPipe) freightId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<FreightPhotoResponseDto[]> {
    return this.photosService.findByFreight(freightId, currentUser);
  }

  @Delete(':freightId/photos/:photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RoleTypes(RoleTypeEnum.CUSTOMER)
  @Permissions(CUSTOMER_PERMISSIONS.FREIGHTS_UPDATE)
  @ApiAuthorization({
    summary: 'Remover foto do frete',
    description:
      'Remove uma foto do frete. Apenas o dono do frete pode remover fotos.',
    roleTypes: [RoleTypeEnum.CUSTOMER],
    permissions: [CUSTOMER_PERMISSIONS.FREIGHTS_UPDATE],
  })
  @ApiResponse({
    status: 204,
    description: 'Foto removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Frete ou foto não encontrada' })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é o dono do frete',
  })
  async delete(
    @Param('freightId', ParseUUIDPipe) freightId: string,
    @Param('photoId', ParseUUIDPipe) photoId: string,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<void> {
    return this.photosService.delete(freightId, photoId, currentUser.id);
  }
}
