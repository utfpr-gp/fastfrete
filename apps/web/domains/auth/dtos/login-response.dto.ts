import type { User } from '../entities/user.entity'

export interface LoginResponseDTO {
  token: string
  user: User
}
