import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewReviewerDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Ana S.' })
  name!: string;

  @ApiProperty({ example: 'CUSTOMER', nullable: true })
  roleType!: string | null;
}

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

  @ApiPropertyOptional({ type: ReviewReviewerDto })
  reviewer?: ReviewReviewerDto;

  @ApiPropertyOptional({ example: 'Mudança de apartamento' })
  freightTitle?: string;
}
