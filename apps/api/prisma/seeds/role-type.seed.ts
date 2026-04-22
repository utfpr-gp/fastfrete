import type { PrismaClient } from '../../generated/prisma/client';
import { ROLE_TYPES } from '../../src/authorization/definitions/role-types.definition';

export interface SeededRoleType {
  id: string;
  name: string;
}

export async function seedRoleTypes(
  prisma: PrismaClient,
): Promise<SeededRoleType[]> {
  console.log('Seeding role types...');

  const seededRoleTypes: SeededRoleType[] = [];
  let created = 0;
  let skipped = 0;
  let deleted = 0;

  const existingRoleTypes = await prisma.roleType.findMany();
  const existingNames = existingRoleTypes.map((rt) => rt.name);

  const toDelete = existingRoleTypes.filter(
    (rt) => !ROLE_TYPES.includes(rt.name as (typeof ROLE_TYPES)[number]),
  );
  for (const roleType of toDelete) {
    await prisma.roleType.delete({ where: { id: roleType.id } });
    deleted++;
  }

  for (const name of ROLE_TYPES) {
    if (existingNames.includes(name)) {
      const existing = existingRoleTypes.find((rt) => rt.name === name)!;
      skipped++;
      seededRoleTypes.push({ id: existing.id, name: existing.name });
      continue;
    }

    const roleType = await prisma.roleType.create({
      data: { name },
    });

    created++;
    seededRoleTypes.push({ id: roleType.id, name: roleType.name });
  }

  console.log(
    `Role types: ${created} created, ${skipped} skipped, ${deleted} deleted`,
  );
  return seededRoleTypes;
}
