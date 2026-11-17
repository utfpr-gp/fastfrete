import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class RegisterVehicleDto {
  @ApiProperty({ example: 'Van', description: 'Nome da categoria do veículo' })
  @IsNotEmpty({ message: 'A categoria do veículo é obrigatória' })
  @IsString({ message: 'A categoria do veículo deve ser um texto' })
  @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
  vehicleCategory: string;

  @ApiProperty({ example: 'Renault Master 2019', maxLength: 100 })
  @IsNotEmpty({ message: 'O modelo do veículo é obrigatório' })
  @IsString({ message: 'O modelo deve ser um texto' })
  @MaxLength(100, { message: 'O modelo deve ter no máximo 100 caracteres' })
  model: string;

  @ApiProperty({ example: 1200, description: 'Capacidade em quilogramas' })
  @IsNotEmpty({ message: 'A capacidade em kg é obrigatória' })
  @IsNumber({}, { message: 'A capacidade deve ser um número válido' })
  @Min(1, { message: 'A capacidade deve ser maior que zero' })
  @Max(100000, { message: 'A capacidade deve ser no máximo 100.000 kg' })
  capacityKg: number;

  @ApiPropertyOptional({ example: 'ABC-1234', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'A placa deve ter no máximo 20 caracteres' })
  plate?: string;

  @ApiPropertyOptional({ example: 'Branca', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'A cor deve ter no máximo 50 caracteres' })
  color?: string;
}
