import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/index.js';
import { FreightStatus } from '../entities/freight.entity.js';

export enum FreightOrderBy {
  RECENT = 'recent',
  OLDEST = 'oldest',
}

export class FreightsFilterDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: FreightStatus })
  @IsOptional()
  @IsEnum(FreightStatus, { message: 'Status inválido' })
  status?: FreightStatus;

  @ApiPropertyOptional({ example: 'Van' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  vehicleCategory?: string;

  @ApiPropertyOptional({ enum: FreightOrderBy, default: FreightOrderBy.RECENT })
  @IsOptional()
  @IsEnum(FreightOrderBy, { message: 'Ordenação inválida' })
  orderBy?: FreightOrderBy;
}
