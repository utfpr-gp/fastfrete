import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { seedUsers } from './seeds/user.seed';
import { seedRoleTypes } from './seeds/role-type.seed';
import { seedPermissions } from './seeds/permission.seed';
import { seedRoles } from './seeds/role.seed';
import { seedRolePermissions } from './seeds/role-permission.seed';
import { seedUserRoles } from './seeds/user-role.seed';
import { seedVehicleCategories } from './seeds/vehicle-category.seed';

// load .env from project root (cwd is apps/api when running the script)
dotenv.config();

// instantiate the Prisma client with the Postgres adapter required by
// the Prisma runtime engine configuration
const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL || '') } as any);

/**
 * Main seed function that orchestrates all seeds
 * Seeds are executed in order to respect relationships
 */
async function main(): Promise<void> {
  console.log('🚀 Starting database seeding...\n');

  try {
    // ====================
    // Phase 1: Independent entities
    // ====================
    const roleTypes = await seedRoleTypes(prisma);
    const usersResult = await seedUsers(prisma);
    const permissions = await seedPermissions(prisma);
    const vehicleCategories = await seedVehicleCategories(prisma);

    // ====================
    // Phase 2: Entities with single dependency
    // ====================
    const roles = await seedRoles(prisma, roleTypes);

    // ====================
    // Phase 3: Junction tables / Many-to-many
    // ====================
    await seedRolePermissions(prisma, roles, permissions, roleTypes);
    await seedUserRoles(prisma, usersResult.items, roles);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Role types: ${roleTypes.length}`);
    console.log(
      `   - Users: ${usersResult.created} created, ${usersResult.skipped} skipped`,
    );
    console.log(`   - Permissions: ${permissions.length}`);
    console.log(`   - Roles: ${roles.length}`);
    console.log(`   - Vehicle categories: ${vehicleCategories.length}`);
  } catch (error) {
    console.error('\n❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
