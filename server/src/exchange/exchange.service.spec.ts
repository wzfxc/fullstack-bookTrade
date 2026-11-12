import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/public-user-select';
import { ExchangeService } from './exchange.service';

describe('ExchangeService.requestExchange', () => {
  const requester: PublicUser = {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'requester@example.com',
    name: 'Requester',
    role: Role.USER,
    avatarUrl: null,
  };
  const owner: PublicUser = {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'owner@example.com',
    name: 'Owner',
    role: Role.USER,
    avatarUrl: null,
  };
  const bookId = '33333333-3333-4333-8333-333333333333';

  let prismaService: {
    book: { findUnique: jest.Mock; findMany: jest.Mock };
    exchangeRequest: { create: jest.Mock };
  };
  let mailService: { sendExchangeRequest: jest.Mock };
  let exchangeService: ExchangeService;

  beforeEach(() => {
    prismaService = {
      book: { findUnique: jest.fn(), findMany: jest.fn() },
      exchangeRequest: { create: jest.fn() },
    };
    mailService = { sendExchangeRequest: jest.fn() };
    exchangeService = new ExchangeService(
      prismaService as unknown as PrismaService,
      mailService as unknown as MailService,
    );
  });

  it('throws NotFoundException without sending email when the book is gone', async () => {
    prismaService.book.findUnique.mockResolvedValue(null);

    await expect(exchangeService.requestExchange(bookId, requester)).rejects.toThrow(
      new NotFoundException('Book no longer exists or was deleted'),
    );
    expect(prismaService.exchangeRequest.create).not.toHaveBeenCalled();
    expect(mailService.sendExchangeRequest).not.toHaveBeenCalled();
  });

  it('throws BadRequestException when the requester owns the book', async () => {
    prismaService.book.findUnique.mockResolvedValue({
      id: bookId,
      userId: requester.id,
      user: requester,
    });

    await expect(exchangeService.requestExchange(bookId, requester)).rejects.toThrow(
      new BadRequestException('Cannot request exchange for your own book'),
    );
    expect(prismaService.exchangeRequest.create).not.toHaveBeenCalled();
    expect(mailService.sendExchangeRequest).not.toHaveBeenCalled();
  });

  it('records the exchange request and emails the owner with the requester details and books', async () => {
    const requestedBook = {
      id: bookId,
      userId: owner.id,
      name: 'Dune',
      author: 'Herbert',
      user: owner,
    };
    const requesterBooks = [{ id: 'book-1', name: 'Emma', author: 'Austen' }];
    prismaService.book.findUnique.mockResolvedValue(requestedBook);
    prismaService.book.findMany.mockResolvedValue(requesterBooks);

    await exchangeService.requestExchange(bookId, requester);

    expect(prismaService.book.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: bookId } }),
    );
    expect(prismaService.exchangeRequest.create).toHaveBeenCalledWith({
      data: {
        requesterId: requester.id,
        ownerId: owner.id,
        bookId: requestedBook.id,
      },
    });
    expect(mailService.sendExchangeRequest).toHaveBeenCalledWith({
      requestedBook,
      bookOwner: owner,
      requester,
      requesterBooks,
    });
  });
});
