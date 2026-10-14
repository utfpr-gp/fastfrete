import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Fiorino' })
  @IsNotEmpty({ message: 'A categoria do veículo é obrigatória' })
  @IsUUID('4', { message: 'O ID da categoria deve ser um UUID válido' })
  vehicleCategoryId: string;

  @ApiProperty({ example: 'Fiorino 1.3', maxLength: 100 })
  @IsNotEmpty({ message: 'O modelo do veículo é obrigatório' })
  @IsString()
  @MaxLength(100, { message: 'O modelo deve ter no máximo 100 caracteres' })
  model: string;

  @ApiPropertyOptional({ example: 'ABC-1234', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'A placa deve ter no máximo 20 caracteres' })
  plate?: string;

  @ApiProperty({ example: 1000, description: 'Capacidade em quilogramas' })
  @IsNotEmpty({ message: 'A capacidade em kg é obrigatória' })
  @IsNumber({}, { message: 'A capacidade deve ser um número válido' })
  @Min(1, { message: 'A capacidade deve ser maior que zero' })
  capacityKg: number;

  @ApiPropertyOptional({ example: 'Branca', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'A cor deve ter no máximo 50 caracteres' })
  color?: string;
}
