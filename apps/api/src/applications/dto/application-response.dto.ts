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

  @ApiProperty({ enum: ApplicationStatus })
  status!: ApplicationStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
