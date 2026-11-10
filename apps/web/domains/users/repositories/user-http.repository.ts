import type { IUserRepository } from './user.repository.interface'
import type { User } from '~~/domains/auth/entities/user.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'

export class UserHttpRepository implements IUserRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getProfile(): Promise<HttpResult<User>> {
    return this.httpClient.get<User>('/api/users/profile')
  }
}
