import type { User } from '../entities/user.entity'

export interface LoginResponseDTO {
  accessToken: string
  user: User
}
