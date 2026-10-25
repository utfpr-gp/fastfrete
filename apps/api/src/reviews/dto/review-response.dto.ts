import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  freightId!: string;

  @ApiProperty()
  reviewerId!: string;

  @ApiProperty()
  reviewedId!: string;

  @ApiProperty({ example: 5 })
  rating!: number;

  @ApiPropertyOptional()
  comment!: string | null;

  @ApiProperty()
  createdAt!: Date;
}
