import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/index.js';
import { FreightStatus } from '../entities/freight.entity.js';

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
}
