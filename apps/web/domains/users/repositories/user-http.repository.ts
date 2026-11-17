import type { IUserRepository, PaginatedResponse } from './user.repository.interface'
import type { User } from '~~/domains/auth/entities/user.entity'
import type { IHttpClient, HttpResult } from '~~/infra/http/http-client.interface'
import type { AdminUsersFilterDto } from '../dtos/admin-users-filter.dto'
import type { UpdateProfileDto } from '../dtos/update-profile.dto'
import type { PublicProfile } from '../entities/public-profile.entity'

export class UserHttpRepository implements IUserRepository {
  private httpClient: IHttpClient

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient
  }

  async getProfile(): Promise<HttpResult<User>> {
    return this.httpClient.get<User>('/api/users/profile')
  }

  async updateProfile(data: UpdateProfileDto): Promise<HttpResult<User>> {
    return this.httpClient.patch<User>('/api/users/profile', data)
  }

  async getPublicProfile(id: string): Promise<HttpResult<PublicProfile>> {
    return this.httpClient.get<PublicProfile>(`/api/users/${id}/public-profile`)
  }

  async findAllAdmin(filter: AdminUsersFilterDto): Promise<HttpResult<PaginatedResponse<User>>> {
    const params: Record<string, string | number> = {}

    if (filter.name) params.name = filter.name
    if (filter.status) params.status = filter.status
    if (filter.page) params.page = filter.page
    if (filter.limit) params.limit = filter.limit

    return this.httpClient.get<PaginatedResponse<User>>('/api/admin/users', { params })
  }

  async suspendUser(id: string, reason: string): Promise<HttpResult<User>> {
    return this.httpClient.patch<User>(`/api/admin/users/${id}/suspend`, { reason })
  }

  async reactivateUser(id: string): Promise<HttpResult<User>> {
    return this.httpClient.patch<User>(`/api/admin/users/${id}/reactivate`)
  }
}
