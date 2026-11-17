import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  IsString,
  IsUUID,
  IsDateString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FreightDateMode } from '../entities/freight.entity.js';

export class CreateFreightDto {
  @ApiProperty({ example: 'Mudança residencial - centro ao bairro', maxLength: 150 })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString()
  @MinLength(3, { message: 'O título deve ter pelo menos 3 caracteres' })
  @MaxLength(150, { message: 'O título deve ter no máximo 150 caracteres' })
  title: string;

  @ApiProperty({ example: 'Aproximadamente 2 cômodos, sem móveis pesados.' })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Van', maxLength: 50 })
  @IsNotEmpty({ message: 'A categoria de veículo é obrigatória' })
  @IsString()
  @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
  vehicleCategory: string;

  @ApiProperty({ example: 'uuid-da-cidade-de-origem' })
  @IsNotEmpty({ message: 'A cidade de origem é obrigatória' })
  @IsUUID('4', { message: 'O ID da cidade de origem deve ser um UUID válido' })
  originCityId: string;

  @ApiProperty({ example: 'Centro', maxLength: 100 })
  @IsNotEmpty({ message: 'O bairro de origem é obrigatório' })
  @IsString()
  @MaxLength(100, { message: 'O bairro de origem deve ter no máximo 100 caracteres' })
  originDistrict: string;

  @ApiProperty({ example: 'Rua XV de Novembro', maxLength: 150 })
  @IsNotEmpty({ message: 'A rua de origem é obrigatória' })
  @IsString()
  @MaxLength(150, { message: 'A rua de origem deve ter no máximo 150 caracteres' })
  originStreet: string;

  @ApiProperty({ example: '123', maxLength: 20 })
  @IsNotEmpty({ message: 'O número de origem é obrigatório' })
  @IsString()
  @MaxLength(20, { message: 'O número de origem deve ter no máximo 20 caracteres' })
  originNumber: string;

  @ApiProperty({ example: 'uuid-da-cidade-de-destino' })
  @IsNotEmpty({ message: 'A cidade de destino é obrigatória' })
  @IsUUID('4', { message: 'O ID da cidade de destino deve ser um UUID válido' })
  destinationCityId: string;

  @ApiProperty({ example: 'Batel', maxLength: 100 })
  @IsNotEmpty({ message: 'O bairro de destino é obrigatório' })
  @IsString()
  @MaxLength(100, { message: 'O bairro de destino deve ter no máximo 100 caracteres' })
  destinationDistrict: string;

  @ApiProperty({ example: 'Avenida Iguaçu', maxLength: 150 })
  @IsNotEmpty({ message: 'A rua de destino é obrigatória' })
  @IsString()
  @MaxLength(150, { message: 'A rua de destino deve ter no máximo 150 caracteres' })
  destinationStreet: string;

  @ApiProperty({ example: '456', maxLength: 20 })
  @IsNotEmpty({ message: 'O número de destino é obrigatório' })
  @IsString()
  @MaxLength(20, { message: 'O número de destino deve ter no máximo 20 caracteres' })
  destinationNumber: string;

  @ApiProperty({ enum: FreightDateMode, example: FreightDateMode.IMMEDIATE })
  @IsNotEmpty({ message: 'O modo de data é obrigatório' })
  @IsEnum(FreightDateMode, { message: 'O modo de data deve ser IMMEDIATE, SCHEDULED ou FLEXIBLE' })
  dateMode: FreightDateMode;

  @ApiPropertyOptional({ example: '2026-06-01T10:00:00Z' })
  @IsOptional()
  @IsDateString({}, { message: 'A data deve ser uma data válida no formato ISO 8601' })
  exactDatetime?: string;

  @ApiPropertyOptional({ example: '08:00-12:00', maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30, { message: 'A janela de disponibilidade deve ter no máximo 30 caracteres' })
  availabilityWindow?: string;

  @ApiPropertyOptional({
    example: 350,
    description: 'Valor sugerido pelo cliente, em reais (opcional)',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O valor sugerido deve ser um número com até 2 casas decimais' },
  )
  @Min(0.01, { message: 'O valor sugerido deve ser maior que zero' })
  @Max(1000000, { message: 'O valor sugerido deve ser no máximo R$ 1.000.000' })
  suggestedPrice?: number | null;
}
