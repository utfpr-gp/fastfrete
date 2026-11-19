import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ReviewsService } from '../reviews.service.js';
import { CreateReviewDto } from '../dto/create-review.dto.js';
import { ReviewResponseDto } from '../dto/review-response.dto.js';
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

@ApiTags('Freights / Reviews')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, ReviewResponseDto)
@Controller('freights')
@UseGuards(AuthorizationGuard)
export class FreightReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':freightId/reviews')
  @HttpCode(HttpStatus.CREATED)
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER)
  @Permissions(
    CUSTOMER_PERMISSIONS.REVIEWS_CREATE,
    CARRIER_PERMISSIONS.REVIEWS_CREATE,
  )
  @ApiAuthorization({
    summary: 'Criar avaliação de frete',
    description:
      'Permite que cliente ou fretista avalie um frete concluído. Apenas participantes do frete podem avaliar, e cada usuário só pode avaliar uma vez por frete.',
    roleTypes: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER],
    permissions: [
      CUSTOMER_PERMISSIONS.REVIEWS_CREATE,
      CARRIER_PERMISSIONS.REVIEWS_CREATE,
    ],
  })
  @ApiResponse({
    status: 201,
    description: 'Avaliação criada com sucesso',
    type: ReviewResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  @ApiResponse({
    status: 403,
    description: 'Usuário não faz parte do frete ou frete não concluído',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já avaliou este frete',
  })
  async create(
    @Param('freightId', ParseUUIDPipe) freightId: string,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: CurrentUserData,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.create(
      freightId,
      currentUser.id,
      createReviewDto,
    );
  }

  @Get(':freightId/reviews')
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER, RoleTypeEnum.ADMIN)
  @Permissions(
    CUSTOMER_PERMISSIONS.REVIEWS_LIST,
    CARRIER_PERMISSIONS.REVIEWS_LIST,
    ADMIN_PERMISSIONS.REVIEWS_LIST,
  )
  @ApiAuthorization({
    summary: 'Listar avaliações de um frete',
    description:
      'Retorna todas as avaliações associadas a um frete específico.',
    roleTypes: [
      RoleTypeEnum.CUSTOMER,
      RoleTypeEnum.CARRIER,
      RoleTypeEnum.ADMIN,
    ],
    permissions: [
      CUSTOMER_PERMISSIONS.REVIEWS_LIST,
      CARRIER_PERMISSIONS.REVIEWS_LIST,
      ADMIN_PERMISSIONS.REVIEWS_LIST,
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações do frete',
    type: [ReviewResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Frete não encontrado' })
  async findByFreight(
    @Param('freightId', ParseUUIDPipe) freightId: string,
  ): Promise<ReviewResponseDto[]> {
    return this.reviewsService.findByFreight(freightId);
  }
}
