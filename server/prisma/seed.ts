import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const PASSWORD_SALT_ROUNDS = 10;

async function seedAdministrator(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed an administrator');
  }

  const prismaClient = new PrismaClient();

  try {
    await prismaClient.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: await bcrypt.hash(password, PASSWORD_SALT_ROUNDS),
        name: process.env.ADMIN_NAME ?? 'Administrator',
        role: Role.ADMIN,
      },
    });
  } finally {
    await prismaClient.$disconnect();
  }
}

seedAdministrator();

