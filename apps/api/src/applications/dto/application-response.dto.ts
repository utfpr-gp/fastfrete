import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApplicationStatus,
  ApplicationVehicle,
} from '../entities/application.entity.js';

export class ApplicationVehicleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  model!: string;

  @ApiProperty({ nullable: true })
  plate!: string | null;

  @ApiProperty()
  capacityKg!: string;

  @ApiProperty({ nullable: true })
  color!: string | null;

  @ApiProperty()
  vehicleCategoryName!: string;
}

export class ApplicationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  freightId!: string;

  @ApiProperty()
  freighterId!: string;

  @ApiProperty()
  vehicleId!: string;

  @ApiPropertyOptional({ type: ApplicationVehicleDto })
  vehicle!: ApplicationVehicle | null;

  @ApiProperty({ example: '500.00' })
  proposedPrice!: string;

  @ApiPropertyOptional({ example: 'Olá, tenho ajudante e o veículo está limpo.' })
  message!: string | null;

  @ApiProperty({ enum: ApplicationStatus })
  status!: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Indica se o fretista já avaliou este frete', default: false })
  hasReviewed?: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
