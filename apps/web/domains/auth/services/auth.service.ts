import type { IAuthRepository } from '../repositories/auth.repository.interface'
import type { LoginRequestDTO } from '../dtos/login-request.dto'
import type { LoginResponseDTO } from '../dtos/login-response.dto'
import type { SignupRequestDTO } from '../dtos/signup-request.dto'
import type { ForgotPasswordRequestDTO } from '../dtos/forgot-password-request.dto'
import type { ResetPasswordRequestDTO } from '../dtos/reset-password-request.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class AuthService {
  private repository: IAuthRepository

  constructor(repository: IAuthRepository) {
    this.repository = repository
  }

  async login(data: LoginRequestDTO): Promise<HttpResult<LoginResponseDTO>> {
    return this.repository.login(data)
  }

  async signup(data: SignupRequestDTO): Promise<HttpResult<void>> {
    return this.repository.signup(data)
  }

  async forgotPassword(data: ForgotPasswordRequestDTO): Promise<HttpResult<void>> {
    return this.repository.forgotPassword(data)
  }

  async resetPassword(data: ResetPasswordRequestDTO): Promise<HttpResult<void>> {
    return this.repository.resetPassword(data)
  }
}
