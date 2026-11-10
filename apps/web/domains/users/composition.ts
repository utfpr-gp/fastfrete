import { HttpClient } from '~~/infra/http/http-client'
import { UserHttpRepository } from '~~/domains/users/repositories/user-http.repository'
import { UserService } from './services/user.service'

export function createUserService(): UserService {
  const config = useRuntimeConfig()
  const httpClient = new HttpClient(config.public.baseURL as string)
  const userRepository = new UserHttpRepository(httpClient)
  return new UserService(userRepository)
}
