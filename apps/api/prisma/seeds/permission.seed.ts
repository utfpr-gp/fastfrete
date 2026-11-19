import type { PrismaClient } from '../../generated/prisma/client';
import { ALL_PERMISSIONS } from '../../src/authorization/definitions/permissions.definition';

export interface SeededPermission {
  id: string;
  name: string;
}

export async function seedPermissions(
  prisma: PrismaClient,
): Promise<SeededPermission[]> {
  console.log('Seeding permissions...');

  const seededPermissions: SeededPermission[] = [];
  let created = 0;
  let skipped = 0;
  let deleted = 0;

  const existingPermissions = await prisma.permission.findMany();
  const existingNames = new Set(existingPermissions.map((p) => p.name));

  for (const permission of existingPermissions) {
    if (!ALL_PERMISSIONS.includes(permission.name)) {
      await prisma.permission.delete({ where: { id: permission.id } });
      deleted++;
    }
  }

  for (const permissionName of ALL_PERMISSIONS) {
    if (existingNames.has(permissionName)) {
      const existing = existingPermissions.find(
        (p) => p.name === permissionName,
      )!;
      skipped++;
      seededPermissions.push({
        id: existing.id,
        name: existing.name,
      });
      continue;
    }

    const permission = await prisma.permission.create({
      data: {
        name: permissionName,
      },
    });

    created++;
    seededPermissions.push({
      id: permission.id,
      name: permission.name,
    });
  }

  console.log(
    `Permissions: ${created} created, ${skipped} skipped, ${deleted} deleted`,
  );
  return seededPermissions;
}
