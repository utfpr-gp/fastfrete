import { ApiProperty } from '@nestjs/swagger';
import { FreightResponseDto } from './freight-response.dto.js';

export class AdminFreightResponseDto extends FreightResponseDto {
  @ApiProperty({ example: 'Ana Souza' })
  clientName!: string;

  @ApiProperty({ example: 3 })
  applicationsCount!: number;
}
