import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/index.js';

export class ReviewsFilterDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'uuid-do-frete' })
  @IsOptional()
  @IsUUID('4', { message: 'freightId deve ser um UUID válido' })
  freightId?: string;
}
