import type { User } from '~~/domains/auth/entities/user.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export interface IUserRepository {
  getProfile(): Promise<HttpResult<User>>
}
