import type { LoginRequestDTO } from '../dtos/login-request.dto'
import type { LoginResponseDTO } from '../dtos/login-response.dto'
import type { SignupRequestDTO } from '../dtos/signup-request.dto'
import type { ForgotPasswordRequestDTO } from '../dtos/forgot-password-request.dto'
import type { ResetPasswordRequestDTO } from '../dtos/reset-password-request.dto'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface IAuthRepository {
  login(data: LoginRequestDTO): Promise<HttpResult<LoginResponseDTO>>
  signup(data: SignupRequestDTO): Promise<HttpResult<void>>
  forgotPassword(data: ForgotPasswordRequestDTO): Promise<HttpResult<void>>
  resetPassword(data: ResetPasswordRequestDTO): Promise<HttpResult<void>>
}
