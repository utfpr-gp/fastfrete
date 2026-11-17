import type { IUserRepository, PaginatedResponse } from '../repositories/user.repository.interface'
import type { User } from '~~/domains/auth/entities/user.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'
import type { AdminUsersFilterDto } from '../dtos/admin-users-filter.dto'

export class UserService {
  private repository: IUserRepository

  constructor(repository: IUserRepository) {
    this.repository = repository
  }

  async getProfile(): Promise<HttpResult<User>> {
    return this.repository.getProfile()
  }

  async findAllAdmin(filter: AdminUsersFilterDto): Promise<HttpResult<PaginatedResponse<User>>> {
    return this.repository.findAllAdmin(filter)
  }

  async suspendUser(id: string, reason: string): Promise<HttpResult<User>> {
    return this.repository.suspendUser(id, reason)
  }

  async reactivateUser(id: string): Promise<HttpResult<User>> {
    return this.repository.reactivateUser(id)
  }
}
