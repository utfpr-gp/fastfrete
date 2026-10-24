import { PrismaClient, Vehicle } from '../../generated/prisma/client';
import { SeededUser } from './user.seed';
import { SeededVehicleCategory } from './vehicle-category.seed';

export interface SeededVehicle {
  id: string;
  userId: string;
  model: string;
  plate: string | null;
}

interface VehicleData {
  userEmail: string;
  vehicleCategoryName: string;
  model: string;
  plate: string | null;
  capacityKg: number;
  color: string | null;
  active: boolean;
}

const VEHICLES_DATA: VehicleData[] = [
  {
    userEmail: 'jane.smith@example.com',
    vehicleCategoryName: 'Fiorino',
    model: 'Fiat Fiorino 2020',
    plate: 'ABC-1234',
    capacityKg: 500,
    color: 'Branco',
    active: true,
  },
  {
    userEmail: 'jane.smith@example.com',
    vehicleCategoryName: 'Van',
    model: 'Renault Master 2019',
    plate: 'DEF-5678',
    capacityKg: 1200,
    color: 'Prata',
    active: true,
  },
];

export async function seedVehicles(
  prisma: PrismaClient,
  users: SeededUser[],
  vehicleCategories: SeededVehicleCategory[],
): Promise<SeededVehicle[]> {
  console.log('🌱 Seeding vehicles...');

  const seededVehicles: SeededVehicle[] = [];
  let created = 0;
  let skipped = 0;

  for (const vehicleData of VEHICLES_DATA) {
    const user = users.find((u) => u.email === vehicleData.userEmail);
    const category = vehicleCategories.find(
      (c) => c.name === vehicleData.vehicleCategoryName,
    );

    if (!user) {
      console.warn(`   ⚠️  User ${vehicleData.userEmail} not found`);
      continue;
    }

    if (!category) {
      console.warn(
        `   ⚠️  Vehicle category ${vehicleData.vehicleCategoryName} not found`,
      );
      continue;
    }

    const existing = await prisma.vehicle.findFirst({
      where: {
        userId: user.id,
        model: vehicleData.model,
      },
    });

    if (existing) {
      skipped++;
      seededVehicles.push({
        id: existing.id,
        userId: existing.userId,
        model: existing.model,
        plate: existing.plate,
      });
      continue;
    }

    const vehicle: Vehicle = await prisma.vehicle.create({
      data: {
        userId: user.id,
        vehicleCategoryId: category.id,
        model: vehicleData.model,
        plate: vehicleData.plate,
        capacityKg: vehicleData.capacityKg,
        color: vehicleData.color,
        active: vehicleData.active,
      },
    });

    created++;
    seededVehicles.push({
      id: vehicle.id,
      userId: vehicle.userId,
      model: vehicle.model,
      plate: vehicle.plate,
    });
  }

  console.log(`✅ Vehicles: ${created} created, ${skipped} skipped`);
  return seededVehicles;
}
