import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordForgotDto } from './dto/password-forgot.dto';
import { PasswordResetDto } from './dto/password-reset.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from '../authorization/decorators/public.decorator';
import { ApiAuthorization } from '../common/swagger/api-authorization.decorator';
import { ApiValidationError } from '../common/swagger/api-validation-error.decorator';
import { ValidationErrorResponseDto } from '../common/swagger/validation-error-response.dto';

@ApiTags('Auth')
@ApiExtraModels(ValidationErrorResponseDto)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiAuthorization({
    summary: 'Registrar novo usuário',
    description:
      'Cria um novo usuário. Apenas CUSTOMER ou CARRIER podem se registrar por esta rota.',
    isPublic: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado no sistema',
  })
  @ApiValidationError()
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authenticationService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiAuthorization({
    summary: 'Autenticar usuário',
    description: 'Realiza login e retorna um token JWT.',
    isPublic: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @ApiValidationError()
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authenticationService.login(loginDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuthorization({
    summary: 'Solicitar redefinição de senha',
    description:
      'Envia um email com link para redefinir a senha. Sempre retorna 204 para não revelar se o email está cadastrado.',
    isPublic: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Solicitação processada',
  })
  @ApiValidationError()
  async forgotPassword(@Body() dto: PasswordForgotDto): Promise<void> {
    await this.authenticationService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiAuthorization({
    summary: 'Redefinir senha',
    description: 'Redefine a senha usando o token recebido por email.',
    isPublic: true,
  })
  @ApiResponse({
    status: 204,
    description: 'Senha redefinida com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido ou expirado',
  })
  @ApiValidationError()
  async resetPassword(@Body() dto: PasswordResetDto): Promise<void> {
    await this.authenticationService.resetPassword(dto);
  }
}
