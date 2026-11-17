import { ApiProperty } from '@nestjs/swagger';

export class UsersMetricsDto {
  @ApiProperty({ description: 'Clientes + fretistas', example: 42 })
  total!: number;

  @ApiProperty({ example: 30 })
  customers!: number;

  @ApiProperty({ example: 12 })
  carriers!: number;

  @ApiProperty({ example: 2 })
  suspended!: number;
}

export class FreightsMetricsDto {
  @ApiProperty({ example: 80 })
  total!: number;

  @ApiProperty({ example: 10 })
  open!: number;

  @ApiProperty({ example: 5 })
  negotiating!: number;

  @ApiProperty({ example: 8 })
  inProgress!: number;

  @ApiProperty({ example: 50 })
  completed!: number;

  @ApiProperty({ example: 7 })
  cancelled!: number;
}

export class ApplicationsMetricsDto {
  @ApiProperty({ example: 120 })
  total!: number;

  @ApiProperty({ example: 20 })
  pending!: number;

  @ApiProperty({ example: 15 })
  accepted!: number;

  @ApiProperty({ example: 30 })
  rejected!: number;

  @ApiProperty({ example: 10 })
  withdrawn!: number;

  @ApiProperty({ example: 45 })
  completed!: number;
}

export class ReviewsMetricsDto {
  @ApiProperty({ example: 90 })
  total!: number;

  @ApiProperty({ example: 4.3 })
  averageRating!: number;
}

export class AdminMetricsResponseDto {
  @ApiProperty({ type: UsersMetricsDto })
  users!: UsersMetricsDto;

  @ApiProperty({ type: FreightsMetricsDto })
  freights!: FreightsMetricsDto;

  @ApiProperty({ type: ApplicationsMetricsDto })
  applications!: ApplicationsMetricsDto;

  @ApiProperty({ type: ReviewsMetricsDto })
  reviews!: ReviewsMetricsDto;
}
