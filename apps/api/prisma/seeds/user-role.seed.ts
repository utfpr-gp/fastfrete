import { PrismaClient } from '../../generated/prisma/client';
import { SeededUser } from './user.seed';
import { SeededRole } from './role.seed';
import { RoleTypeEnum } from '../../src/authorization/definitions/role-types.definition';

interface UserRoleAssignment {
  userEmail: string;
  roleName: string;
}

const USER_ROLE_ASSIGNMENTS: UserRoleAssignment[] = [
  { userEmail: 'admin@fastfrete.com', roleName: RoleTypeEnum.ADMIN },
  { userEmail: 'john.doe@example.com', roleName: RoleTypeEnum.CUSTOMER },
  { userEmail: 'jane.smith@example.com', roleName: RoleTypeEnum.CARRIER },
];

export async function seedUserRoles(
  prisma: PrismaClient,
  users: SeededUser[],
  roles: SeededRole[],
): Promise<void> {
  console.log('🌱 Seeding user roles...');

  let created = 0;
  let skipped = 0;

  for (const assignment of USER_ROLE_ASSIGNMENTS) {
    const user = users.find((u) => u.email === assignment.userEmail);
    const role = roles.find((r) => r.name === assignment.roleName);

    if (!user) {
      console.warn(`   ⚠️  User ${assignment.userEmail} not found`);
      continue;
    }

    if (!role) {
      console.warn(`   ⚠️  Role ${assignment.roleName} not found`);
      continue;
    }

    const existing = await prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    created++;
  }

  console.log(`✅ User roles: ${created} created, ${skipped} skipped`);
}

