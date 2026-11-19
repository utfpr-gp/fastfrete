import { ApiProperty } from '@nestjs/swagger';

export class CityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'Guarapuava' })
  name!: string;

  @ApiProperty({ example: 'PR' })
  state!: string;
}
