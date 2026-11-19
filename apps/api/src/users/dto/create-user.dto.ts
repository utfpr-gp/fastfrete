import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition.js';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Maria Santos',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser um texto' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário (deve ser único no sistema)',
    example: 'maria.santos@exemplo.com',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email: string;

  @ApiProperty({
    description:
      'Senha do usuário (mínimo 8 caracteres, deve conter maiúscula, minúscula e número)',
    example: 'SenhaForte123',
    minLength: 8,
    maxLength: 50,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'A senha deve ter no máximo 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;

  @ApiProperty({
    description: 'Telefone no formato internacional (obrigatório para contato)',
    example: '+5511888888888',
  })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString({ message: 'O telefone deve ser um texto' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'O telefone deve ser um número válido no formato internacional (ex: +5511999999999)',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Tipo de usuário a ser criado',
    enum: RoleTypeEnum,
    example: RoleTypeEnum.CUSTOMER,
  })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsEnum(RoleTypeEnum, {
    message: 'O tipo de usuário deve ser ADMIN, CUSTOMER ou CARRIER',
  })
  roleType: RoleTypeEnum;

  @ApiProperty({
    description: 'Identificador da cidade do usuário',
    example: '3b6c1e1c-2a8a-4b6c-9e7d-5f1a2b3c4d5e',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @IsUUID('4', { message: 'A cidade deve ser um UUID válido' })
  cityId: string;
}
