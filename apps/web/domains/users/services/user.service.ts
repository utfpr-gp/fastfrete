import type { IUserRepository, PaginatedResponse } from '../repositories/user.repository.interface'
import type { User } from '~~/domains/auth/entities/user.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'
import type { AdminUsersFilterDto } from '../dtos/admin-users-filter.dto'
import type { UpdateProfileDto } from '../dtos/update-profile.dto'
import type { PublicProfile } from '../entities/public-profile.entity'

export class UserService {
  private repository: IUserRepository

  constructor(repository: IUserRepository) {
    this.repository = repository
  }

  async getProfile(): Promise<HttpResult<User>> {
    return this.repository.getProfile()
  }

  async updateProfile(data: UpdateProfileDto): Promise<HttpResult<User>> {
    return this.repository.updateProfile(data)
  }

  async getPublicProfile(id: string): Promise<HttpResult<PublicProfile>> {
    return this.repository.getPublicProfile(id)
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
