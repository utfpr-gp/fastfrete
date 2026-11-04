import type { IAuthRepository } from './auth.repository.interface'
import type { LoginRequestDTO } from '../dtos/login-request.dto'
import type { LoginResponseDTO } from '../dtos/login-response.dto'
import type { SignupRequestDTO } from '../dtos/signup-request.dto'
import type { ForgotPasswordRequestDTO } from '../dtos/forgot-password-request.dto'
import type { ResetPasswordRequestDTO } from '../dtos/reset-password-request.dto'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class AuthHttpRepository implements IAuthRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async login(data: LoginRequestDTO): Promise<HttpResult<LoginResponseDTO>> {
    return this.httpClient.post<LoginResponseDTO>('/api/auth/login', data)
  }

  async signup(data: SignupRequestDTO): Promise<HttpResult<void>> {
    return this.httpClient.post<void>('/api/auth/register', data)
  }

  async forgotPassword(data: ForgotPasswordRequestDTO): Promise<HttpResult<void>> {
    return this.httpClient.post<void>('/api/auth/forgot-password', data)
  }

  async resetPassword(data: ResetPasswordRequestDTO): Promise<HttpResult<void>> {
    return this.httpClient.post<void>('/api/auth/reset-password', data)
  }
}
