import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  const user: PublicUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'reader@example.com',
    name: 'Reader',
    role: Role.USER,
    avatarUrl: null,
  };

  let prismaService: {
    $transaction: jest.Mock;
    user: { findUnique: jest.Mock };
    book: { count: jest.Mock };
    exchangeRequest: { findMany: jest.Mock };
  };
  let usersService: { updateProfile: jest.Mock };
  let profileService: ProfileService;

  beforeEach(() => {
    prismaService = {
      $transaction: jest.fn(),
      user: { findUnique: jest.fn() },
      book: { count: jest.fn() },
      exchangeRequest: { findMany: jest.fn() },
    };
    usersService = { updateProfile: jest.fn() };
    profileService = new ProfileService(
      prismaService as unknown as PrismaService,
      usersService as unknown as UsersService,
    );
  });

  it('returns user details, booksCount, and incomingRequests', async () => {
    const incomingRequests = [
      {
        id: 'req-1',
        requesterId: 'req-user-id',
        ownerId: user.id,
        bookId: 'book-1',
        createdAt: new Date(),
        requester: { ...user, id: 'req-user-id', email: 'other@example.com' },
        book: { id: 'book-1', name: 'Dune', author: 'Herbert' },
      },
    ];
    prismaService.$transaction.mockResolvedValue([user, 3, incomingRequests]);

    const result = await profileService.getProfile(user.id);

    expect(result).toEqual({
      ...user,
      booksCount: 3,
      incomingRequests,
    });
  });

  it('throws NotFoundException when the user does not exist', async () => {
    prismaService.$transaction.mockResolvedValue([null, 0, []]);

    await expect(profileService.getProfile(user.id)).rejects.toThrow(NotFoundException);
  });

  it('lowercases email when updating profile', async () => {
    usersService.updateProfile.mockResolvedValue({
      ...user,
      email: 'updated@example.com',
      name: 'Updated Reader',
    });

    await profileService.updateProfile(user.id, {
      name: 'Updated Reader',
      email: 'Updated@Example.COM',
      avatarUrl: 'https://example.com/avatar.png',
    });

    expect(usersService.updateProfile).toHaveBeenCalledWith(user.id, {
      name: 'Updated Reader',
      email: 'updated@example.com',
      avatarUrl: 'https://example.com/avatar.png',
    });
  });
});

