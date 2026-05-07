import { PrismaClient, User, UserStatus } from '../../generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { seedByField, SeedResult } from './seed.helper';

export interface SeededUser {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
}

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function seedUsers(prisma: PrismaClient): Promise<SeedResult<SeededUser>> {
  // Hash passwords before seeding
  const usersData = [
    {
      name: 'Admin User',
      email: 'admin@fastfrete.com',
      password: await hashPassword('admin123456'),
      phoneNumber: '+5511999999999',
      status: UserStatus.ACTIVE,
    },
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await hashPassword('password123'),
      phoneNumber: '+5511888888888',
      status: UserStatus.ACTIVE,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: await hashPassword('password123'),
      phoneNumber: '+5511777777777',
      status: UserStatus.ACTIVE,
    },
  ];

  return seedByField(
    'users',
    prisma.user,
    usersData,
    'email',
    (user: unknown) => {
      const u = user as User;
      return { id: u.id, email: u.email, name: u.name, status: u.status };
    },
  );
}
