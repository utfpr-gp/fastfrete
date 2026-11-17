import { ApiProperty } from '@nestjs/swagger';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';

export class PublicProfileStatsDto {
  @ApiProperty({ example: 4.8 })
  averageRating!: number;

  @ApiProperty({ example: 12 })
  totalReviews!: number;

  @ApiProperty({ example: 15 })
  completedFreights!: number;
}

export class PublicProfileVehicleDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Van' })
  vehicleCategoryName!: string;

  @ApiProperty({ example: 'Renault Master 2019' })
  model!: string;

  @ApiProperty({ example: 1200 })
  capacityKg!: number;
}

export class PublicProfileResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Ana S.' })
  name!: string;

  @ApiProperty({ enum: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER] })
  roleType!: RoleTypeEnum.CUSTOMER | RoleTypeEnum.CARRIER;

  @ApiProperty({ example: 'Guarapuava' })
  cityName!: string;

  @ApiProperty()
  memberSince!: Date;

  @ApiProperty({ type: PublicProfileStatsDto })
  stats!: PublicProfileStatsDto;

  @ApiProperty({ type: [PublicProfileVehicleDto] })
  vehicles!: PublicProfileVehicleDto[];
}
