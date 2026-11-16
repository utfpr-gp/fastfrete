import type { User } from '~~/domains/auth/entities/user.entity'
import type { HttpResult } from '~~/infra/http/http-client.interface'
import type { AdminUsersFilterDto } from '../dtos/admin-users-filter.dto'

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface IUserRepository {
  getProfile(): Promise<HttpResult<User>>
  findAllAdmin(filter: AdminUsersFilterDto): Promise<HttpResult<PaginatedResponse<User>>>
  suspendUser(id: string, reason: string): Promise<HttpResult<User>>
  reactivateUser(id: string): Promise<HttpResult<User>>
}
