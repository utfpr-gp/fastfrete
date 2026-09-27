import { ApiProperty } from '@nestjs/swagger';

export class VehicleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  vehicleCategoryId!: string;

  @ApiProperty({ example: 'Fiorino' })
  vehicleCategoryName!: string;

  @ApiProperty({ example: 'Fiorino 1.3' })
  model!: string;

  @ApiProperty({ example: 'ABC-1234', nullable: true })
  plate!: string | null;

  @ApiProperty({ example: '1000.00' })
  capacityKg!: string;

  @ApiProperty({ example: 'Branca', nullable: true })
  color!: string | null;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
