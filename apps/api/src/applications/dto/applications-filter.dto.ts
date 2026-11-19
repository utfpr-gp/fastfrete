import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/pagination/index.js';
import { ApplicationStatus } from '../entities/application.entity.js';

export class ApplicationsFilterDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus, { message: 'Status inválido' })
  status?: ApplicationStatus;

  @ApiPropertyOptional({ example: 'uuid-do-frete' })
  @IsOptional()
  @IsUUID('4', { message: 'freightId deve ser um UUID válido' })
  freightId?: string;
}
