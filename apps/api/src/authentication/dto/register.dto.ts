import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleTypeEnum } from '../../authorization/definitions/role-types.definition';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser um texto' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({ example: 'joao.silva@exemplo.com' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'O email deve ser um endereço de email válido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email: string;

  @ApiProperty({ example: 'SenhaForte123' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'A senha deve ter no máximo 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número',
  })
  password: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @IsString({ message: 'O telefone deve ser um texto' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'O telefone deve ser um número válido no formato internacional (ex: +5511999999999)',
  })
  phoneNumber: string;

  @ApiProperty({ enum: [RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER] })
  @IsNotEmpty({ message: 'O tipo de usuário é obrigatório' })
  @IsIn([RoleTypeEnum.CUSTOMER, RoleTypeEnum.CARRIER], {
    message: 'O tipo de usuário deve ser CUSTOMER ou CARRIER',
  })
  roleType: RoleTypeEnum.CUSTOMER | RoleTypeEnum.CARRIER;
}
