import type { PrismaClient } from '../../generated/prisma/client';
import type { SeededRole } from './role.seed';
import type { SeededPermission } from './permission.seed';
import type { SeededRoleType } from './role-type.seed';
import { getPermissionsForRoleType } from '../../src/authorization/definitions/permissions.definition';
import { RoleTypeEnum } from '../../src/authorization/definitions/role-types.definition';

export async function seedRolePermissions(
  prisma: PrismaClient,
  roles: SeededRole[],
  permissions: SeededPermission[],
  roleTypes: SeededRoleType[],
): Promise<void> {
  console.log('Seeding role permissions...');

  let created = 0;
  let skipped = 0;

  for (const role of roles) {
    const roleType = roleTypes.find((rt) => rt.id === role.roleTypeId);
    if (!roleType) {
      console.warn(`Role type not found for role ${role.name}`);
      continue;
    }

    const permissionNames = getPermissionsForRoleType(
      roleType.name as RoleTypeEnum,
    );

    const rolePermissions = permissions.filter((p) =>
      permissionNames.includes(p.name),
    );

    for (const permission of rolePermissions) {
      const existing = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });

      created++;
    }
  }

  console.log(`Role permissions: ${created} created, ${skipped} skipped`);
}
