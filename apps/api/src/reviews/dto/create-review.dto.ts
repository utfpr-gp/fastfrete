import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min, Length } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt({ message: 'A nota deve ser um número inteiro' })
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  rating!: number;

  @ApiPropertyOptional({ example: 'Excelente serviço, muito pontual!' })
  @IsOptional()
  @IsString({ message: 'O comentário deve ser um texto' })
  @Length(0, 500, { message: 'O comentário deve ter no máximo 500 caracteres' })
  comment?: string;
}
