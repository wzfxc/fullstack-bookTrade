import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/public-user-select';
import { BooksService } from './books.service';

describe('BooksService.remove', () => {
  const ownerId = '11111111-1111-4111-8111-111111111111';
  const bookId = '22222222-2222-4222-8222-222222222222';
  const book = { id: bookId, userId: ownerId };

  let prismaService: { book: { findUnique: jest.Mock; delete: jest.Mock } };
  let booksService: BooksService;

  const buildUser = (overrides: Partial<PublicUser>): PublicUser => ({
    id: ownerId,
    email: 'user@example.com',
    name: 'User',
    role: Role.USER,
    ...overrides,
  });

  beforeEach(() => {
    prismaService = { book: { findUnique: jest.fn(), delete: jest.fn() } };
    booksService = new BooksService(prismaService as unknown as PrismaService);
  });

  it('deletes the book when the current user owns it', async () => {
    prismaService.book.findUnique.mockResolvedValue(book);

    await booksService.remove(bookId, buildUser({}));

    expect(prismaService.book.delete).toHaveBeenCalledWith({ where: { id: bookId } });
  });

  it('throws ForbiddenException when a regular user deletes someone else’s book', async () => {
    prismaService.book.findUnique.mockResolvedValue(book);

    await expect(
      booksService.remove(bookId, buildUser({ id: '33333333-3333-4333-8333-333333333333' })),
    ).rejects.toThrow(ForbiddenException);
    expect(prismaService.book.delete).not.toHaveBeenCalled();
  });

  it('allows an admin to delete someone else’s book', async () => {
    prismaService.book.findUnique.mockResolvedValue(book);

    await booksService.remove(
      bookId,
      buildUser({ id: '33333333-3333-4333-8333-333333333333', role: Role.ADMIN }),
    );

    expect(prismaService.book.delete).toHaveBeenCalledWith({ where: { id: bookId } });
  });

  it('throws NotFoundException when the book does not exist', async () => {
    prismaService.book.findUnique.mockResolvedValue(null);

    await expect(booksService.remove(bookId, buildUser({}))).rejects.toThrow(NotFoundException);
  });
});

