import { HttpClient } from '../../infra/http/http-client'
import { AuthHttpRepository } from './repositories/auth-http.repository'
import { AuthService } from './services/auth.service'

export function createAuthService(): AuthService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const authRepository = new AuthHttpRepository(httpClient)
  return new AuthService(authRepository)
}
