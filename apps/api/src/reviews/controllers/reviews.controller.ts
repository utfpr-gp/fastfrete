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
import { ReviewsService } from '../reviews.service.js';
import { ReviewResponseDto } from '../dto/review-response.dto.js';
import { ReviewsFilterDto } from '../dto/reviews-filter.dto.js';
import { AuthorizationGuard } from '../../authorization/guards/authorization.guard.js';
import { Permissions } from '../../authorization/decorators/permissions.decorator.js';
import { RoleTypes } from '../../authorization/decorators/role-types.decorator.js';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';
import { CUSTOMER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { CARRIER_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { ADMIN_PERMISSIONS } from '../../authorization/definitions/permissions.definition.js';
import { ApiAuthorization } from '../../common/swagger/api-authorization.decorator.js';
import { ApiPaginatedResponse } from '../../common/pagination/index.js';
import { ValidationErrorResponseDto } from '../../common/swagger/validation-error-response.dto.js';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ValidationErrorResponseDto, ReviewResponseDto)
@Controller('reviews')
@UseGuards(AuthorizationGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('users/:userId')
  @RoleTypes(RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER, RoleTypeEnum.ADMIN)
  @Permissions(
    CUSTOMER_PERMISSIONS.REVIEWS_LIST,
    CARRIER_PERMISSIONS.REVIEWS_LIST,
    ADMIN_PERMISSIONS.REVIEWS_LIST,
  )
  @ApiAuthorization({
    summary: 'Listar avaliações recebidas por um usuário',
    description:
      'Retorna as avaliações recebidas por um usuário (paginado). Útil para exibir no perfil.',
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
  @ApiPaginatedResponse(ReviewResponseDto)
  async findByReviewed(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filterDto: ReviewsFilterDto,
  ): Promise<any> {
    return this.reviewsService.findByReviewed(userId, filterDto);
  }
}
