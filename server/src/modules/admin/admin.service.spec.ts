import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { BooksService } from '../books/books.service';
import { PublicUser } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
import { AdminService } from './admin.service';

describe('AdminService.createBookForUser', () => {
  const targetUser: PublicUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'reader@example.com',
    name: 'Reader',
    role: Role.USER,
    avatarUrl: null,
  };

  let usersService: { findPublicById: jest.Mock };
  let booksService: { create: jest.Mock };
  let adminService: AdminService;

  beforeEach(() => {
    usersService = { findPublicById: jest.fn() };
    booksService = { create: jest.fn() };
    adminService = new AdminService(
      usersService as unknown as UsersService,
      booksService as unknown as BooksService,
    );
  });

  it('verifies the target user exists and creates the book linked to that userId', async () => {
    const bookDto = { name: 'Dune', author: 'Frank Herbert', photoUrl: 'https://example.com/dune.jpg' };
    const createdBook = { id: 'book-id', userId: targetUser.id, ...bookDto };
    usersService.findPublicById.mockResolvedValue(targetUser);
    booksService.create.mockResolvedValue(createdBook);

    const result = await adminService.createBookForUser(targetUser.id, bookDto);

    expect(usersService.findPublicById).toHaveBeenCalledWith(targetUser.id);
    expect(booksService.create).toHaveBeenCalledWith(targetUser.id, bookDto);
    expect(result).toEqual(createdBook);
  });

  it('throws NotFoundException when the target user does not exist', async () => {
    usersService.findPublicById.mockResolvedValue(null);

    await expect(
      adminService.createBookForUser('99999999-9999-4999-8999-999999999999', {
        name: 'Dune',
        author: 'Frank Herbert',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(booksService.create).not.toHaveBeenCalled();
  });
});

