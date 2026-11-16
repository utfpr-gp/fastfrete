import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FreightStatus, FreightDateMode } from '../entities/freight.entity.js';

export class FreightCityDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Guarapuava' })
  name!: string;

  @ApiProperty({ example: 'Paraná' })
  state!: string;
}

export class FreightClientSummaryDto {
  @ApiProperty({ example: 'Ana S.' })
  name!: string;

  @ApiProperty({ example: 4.8 })
  averageRating!: number;

  @ApiProperty({ example: 12 })
  totalReviews!: number;

  @ApiProperty({ example: 15 })
  completedFreights!: number;
}

export class FreightResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  clientId!: string;

  @ApiProperty({ example: 'Mudança residencial - centro ao bairro' })
  title!: string;

  @ApiProperty({ example: 'Aproximadamente 2 cômodos, sem móveis pesados.' })
  description!: string;

  @ApiProperty({ example: 'Van' })
  vehicleCategory!: string;

  @ApiProperty({ type: FreightCityDto })
  originCity!: FreightCityDto;

  @ApiProperty({ example: 'Centro' })
  originDistrict!: string;

  @ApiProperty({ example: 'Rua XV de Novembro' })
  originStreet!: string;

  @ApiProperty({ example: '123' })
  originNumber!: string;

  @ApiProperty({ type: FreightCityDto })
  destinationCity!: FreightCityDto;

  @ApiProperty({ example: 'Batel' })
  destinationDistrict!: string;

  @ApiProperty({ example: 'Avenida Iguaçu' })
  destinationStreet!: string;

  @ApiProperty({ example: '456' })
  destinationNumber!: string;

  @ApiProperty({ enum: FreightDateMode })
  dateMode!: FreightDateMode;

  @ApiProperty({ example: '2026-06-01T10:00:00Z', nullable: true })
  exactDatetime!: Date | null;

  @ApiProperty({ example: '08:00-12:00', nullable: true })
  availabilityWindow!: string | null;

  @ApiProperty({ enum: FreightStatus })
  status!: FreightStatus;

  @ApiProperty({ nullable: true })
  selectedApplicationId!: string | null;

  @ApiPropertyOptional({ description: 'Indica se o cliente já avaliou este frete', default: false })
  hasReviewed?: boolean;

  @ApiPropertyOptional({
    type: FreightClientSummaryDto,
    description: 'Resumo público do cliente, retornado apenas na visão do fretista',
  })
  client?: FreightClientSummaryDto;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;

  @ApiProperty({ nullable: true, example: '/uploads/freight-photos/abc-123.jpg' })
  coverPhoto!: string | null;
}
