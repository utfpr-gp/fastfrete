import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { FreightsFilterDto } from './freights-filter.dto.js';

export class CarrierFreightsFilterDto extends FreightsFilterDto {
  @ApiPropertyOptional({
    description: 'Filtra pela cidade de origem do frete',
    example: 'uuid-da-cidade',
  })
  @IsOptional()
  @IsUUID('4', { message: 'O ID da cidade deve ser um UUID válido' })
  cityId?: string;

  @ApiPropertyOptional({
    description:
      'Quando verdadeiro, retorna apenas fretes cuja categoria corresponde a algum veículo ativo do fretista',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  compatibleOnly?: boolean;
}
