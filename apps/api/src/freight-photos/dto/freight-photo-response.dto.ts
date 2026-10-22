import { ApiProperty } from '@nestjs/swagger';

export class FreightPhotoResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  freightId!: string;

  @ApiProperty({ example: '/uploads/freight-photos/abc123.jpg' })
  url!: string;

  @ApiProperty({ example: 1 })
  order!: number;

  @ApiProperty()
  createdAt!: Date;
}
