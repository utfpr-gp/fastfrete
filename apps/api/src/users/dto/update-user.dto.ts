import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva Atualizado',
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser um texto' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário (deve ser único no sistema)',
    example: 'novo.email@exemplo.com',
    maxLength: 255,
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email?: string;

  @ApiPropertyOptional({
    description:
      'Nova senha do usuário (mínimo 8 caracteres, deve conter maiúscula, minúscula e número)',
    example: 'NovaSenha456',
    minLength: 8,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'A senha deve ter no máximo 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'Telefone no formato internacional',
    example: '+5511777777777',
  })
  @IsOptional()
  @IsString({ message: 'O telefone deve ser um texto' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'O telefone deve ser um número válido no formato internacional (ex: +5511999999999)',
  })
  phoneNumber?: string;
}
