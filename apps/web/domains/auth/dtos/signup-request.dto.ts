export interface SignupRequestDTO {
  name: string
  email: string
  password: string
  phoneNumber: string
  roleType: 'CUSTOMER' | 'CARRIER'
  cityId: string
}
