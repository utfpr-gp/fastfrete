export interface CreateVehicleDto {
  vehicleCategoryId: string
  model: string
  plate?: string
  capacityKg: number
  color?: string
}
