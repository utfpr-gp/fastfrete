import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { FreightsFilterDto } from './freights-filter.dto.js';

export class AdminFreightsFilterDto extends FreightsFilterDto {
  @ApiPropertyOptional({
    example: 'mudança',
    description: 'Busca parcial pelo título do frete',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
