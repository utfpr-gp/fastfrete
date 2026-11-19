import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class SuspendUserDto {
  @ApiProperty({
    description: 'Motivo da suspensão do usuário',
    example: 'Violação das regras da plataforma',
    minLength: 3,
    maxLength: 500,
  })
  @IsString({ message: 'O motivo deve ser um texto' })
  @MinLength(3, { message: 'O motivo deve ter pelo menos 3 caracteres' })
  @MaxLength(500, { message: 'O motivo deve ter no máximo 500 caracteres' })
  reason: string;
}
