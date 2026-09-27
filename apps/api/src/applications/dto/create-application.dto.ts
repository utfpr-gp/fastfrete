import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 'uuid-do-veiculo' })
  @IsUUID('4', { message: 'O ID do veículo deve ser um UUID válido' })
  vehicleId: string;

  @ApiProperty({ example: 500.0 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Valor inválido' })
  @Min(0.01, { message: 'O valor proposto deve ser maior que zero' })
  proposedValue!: number;
}
