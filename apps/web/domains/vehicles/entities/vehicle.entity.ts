export interface Vehicle {
  id: string
  userId: string
  vehicleCategoryId: string
  vehicleCategoryName: string
  model: string
  plate: string | null
  capacityKg: string
  color: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}
