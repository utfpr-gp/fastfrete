export const VEHICLE_CATEGORIES = [
  'Moto',
  'Fiorino',
  'Van',
  'Caminhonete',
  'Caminhão 3/4',
  'Caminhão Toco',
  'Caminhão Truck'
] as const

export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number]
