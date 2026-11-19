import type { PrismaClient } from '../../generated/prisma/client';
import { ROLE_TYPES } from '../../src/authorization/definitions/role-types.definition';
import type { SeededRoleType } from './role-type.seed';

export interface SeededRole {
  id: string;
  name: string;
  roleTypeId: string;
}

export async function seedRoles(
  prisma: PrismaClient,
  roleTypes: SeededRoleType[],
): Promise<SeededRole[]> {
  console.log('Seeding roles...');

  const seededRoles: SeededRole[] = [];
  let created = 0;
  let skipped = 0;

  for (const roleTypeName of ROLE_TYPES) {
    const roleType = roleTypes.find((rt) => rt.name === roleTypeName);
    if (!roleType) {
      console.warn(`Role type ${roleTypeName} not found`);
      continue;
    }

    const existingRole = await prisma.role.findUnique({
      where: { name: roleTypeName },
    });

    if (existingRole) {
      skipped++;
      seededRoles.push({
        id: existingRole.id,
        name: existingRole.name,
        roleTypeId: existingRole.roleTypeId,
      });
      continue;
    }

    const role = await prisma.role.create({
      data: {
        name: roleTypeName,
        roleTypeId: roleType.id,
      },
    });

    created++;
    seededRoles.push({
      id: role.id,
      name: role.name,
      roleTypeId: role.roleTypeId,
    });
  }

  console.log(`Roles: ${created} created, ${skipped} skipped`);
  return seededRoles;
}
