export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
  roles: UserRoleResponseDto[]
  city: CityResponseDto
}

export type UserStatus = 'ACTIVE' | 'SUSPENDED'

export interface UserRoleResponseDto {
  name: string
  roleType: string
  permissions: string[]
}

export interface CityResponseDto {
  id: string
  name: string
  state: string
}
