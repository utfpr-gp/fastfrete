import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateApplicationDto {
  @ApiProperty({ example: 450.0 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor inválido' })
  @Min(0.01, { message: 'O valor proposto deve ser maior que zero' })
  proposedValue!: number;
}
