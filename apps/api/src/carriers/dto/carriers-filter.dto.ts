import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/pagination/index.js';

export class CarriersFilterDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por categoria de veículo',
    example: 'Van',
  })
  @IsOptional()
  @IsString()
  vehicleCategory?: string;
}
