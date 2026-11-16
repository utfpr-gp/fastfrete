export interface AdminUsersFilterDto {
  name?: string
  status?: 'ACTIVE' | 'SUSPENDED'
  page?: number
  limit?: number
}
