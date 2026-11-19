import { PrismaClient, VehicleCategory } from '../../generated/prisma/client';

export interface SeededVehicleCategory {
  id: string;
  name: string;
}

const vehicleCategoriesData = [
  { name: 'Moto' },
  { name: 'Fiorino' },
  { name: 'Van' },
  { name: 'Caminhonete' },
  { name: 'Caminhão 3/4' },
  { name: 'Caminhão Toco' },
  { name: 'Caminhão Truck' },
];

export async function seedVehicleCategories(
  prisma: PrismaClient,
): Promise<SeededVehicleCategory[]> {
  console.log('🌱 Seeding vehicle categories...');

  const seededCategories: SeededVehicleCategory[] = [];
  let created = 0;
  let skipped = 0;

  for (const categoryData of vehicleCategoriesData) {
    const existing = await prisma.vehicleCategory.findUnique({
      where: { name: categoryData.name },
    });

    if (existing) {
      skipped++;
      seededCategories.push({
        id: existing.id,
        name: existing.name,
      });
      continue;
    }

    const category: VehicleCategory = await prisma.vehicleCategory.create({
      data: categoryData,
    });

    created++;
    seededCategories.push({
      id: category.id,
      name: category.name,
    });
  }

  console.log(`✅ Vehicle categories: ${created} created, ${skipped} skipped`);
  return seededCategories;
}

