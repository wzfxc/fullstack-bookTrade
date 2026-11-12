import { Prisma } from '@prisma/client';

export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;
