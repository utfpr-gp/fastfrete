import type { IAuthRepository } from '../repositories/auth.repository.interface'
import type { LoginRequestDTO } from '../dtos/login-request.dto'
import type { LoginResponseDTO } from '../dtos/login-response.dto'
import type { SignupRequestDTO } from '../dtos/signup-request.dto'
import type { HttpResult } from '../../../infra/http/http-client.interface'

export class AuthService {
  private repository: IAuthRepository

  constructor(repository: IAuthRepository) {
    this.repository = repository
  }

  async login(email: string, password: string): Promise<HttpResult<LoginResponseDTO>> {
    const loginData: LoginRequestDTO = { email, password }
    return this.repository.login(loginData)
  }

  async signup(name: string, email: string, password: string): Promise<HttpResult<void>> {
    const signupData: SignupRequestDTO = { name, email, password }
    return this.repository.signup(signupData)
  }
}
