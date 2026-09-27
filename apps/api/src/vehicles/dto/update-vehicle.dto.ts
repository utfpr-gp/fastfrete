import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'uuid-da-categoria' })
  @IsOptional()
  @IsUUID('4', { message: 'O ID da categoria deve ser um UUID válido' })
  vehicleCategoryId?: string;

  @ApiPropertyOptional({ example: 'Fiorino 1.3', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'O modelo deve ter no máximo 100 caracteres' })
  model?: string;

  @ApiPropertyOptional({ example: 'ABC-1234', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'A placa deve ter no máximo 20 caracteres' })
  plate?: string;

  @ApiPropertyOptional({ example: 1000, description: 'Capacidade em quilogramas' })
  @IsOptional()
  @IsNumber({}, { message: 'A capacidade deve ser um número válido' })
  @Min(1, { message: 'A capacidade deve ser maior que zero' })
  capacityKg?: number;

  @ApiPropertyOptional({ example: 'Branca', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'A cor deve ter no máximo 50 caracteres' })
  color?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean({ message: 'O status ativo deve ser verdadeiro ou falso' })
  active?: boolean;
}
