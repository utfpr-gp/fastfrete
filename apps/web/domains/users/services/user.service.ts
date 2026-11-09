import type { IUserRepository } from '../repositories/user.repository.interface'
import type { User } from '~~/domains/auth/entities/user.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'

export class UserService {
  private repository: IUserRepository

  constructor(repository: IUserRepository) {
    this.repository = repository
  }

  async getProfile(): Promise<HttpResult<User>> {
    return this.repository.getProfile()
  }
}
