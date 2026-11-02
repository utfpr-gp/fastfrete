export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'CUSTOMER' | 'CARRIER' | 'ADMIN'
