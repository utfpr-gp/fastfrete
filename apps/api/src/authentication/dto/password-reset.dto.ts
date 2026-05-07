import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class PasswordResetDto {
  @ApiProperty({ example: 'abc123def456...' })
  @IsNotEmpty({ message: 'O token é obrigatório' })
  @IsString({ message: 'O token deve ser um texto' })
  token: string;

  @ApiProperty({ example: 'NovaSenha123' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @IsString({ message: 'A nova senha deve ser um texto' })
  @MinLength(8, { message: 'A nova senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'A nova senha deve ter no máximo 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'A nova senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;
}
