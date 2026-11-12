import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Book, Prisma, Role } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { PublicUser } from '../users/public-user-select';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBooksQueryDto } from './dto/find-books-query.dto';

export interface PaginatedBooks {
  data: Book[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll({ page, limit, search }: FindBooksQueryDto): Promise<PaginatedBooks> {
    const where: Prisma.BookWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.book.count({ where }),
      this.prismaService.book.findMany({
        where,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.prismaService.book.findUnique({ where: { id } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  findAllByOwner(userId: string): Promise<Book[]> {
    return this.prismaService.book.findMany({
      where: { userId },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
  }

  create(userId: string, createBookDto: CreateBookDto): Promise<Book> {
    return this.prismaService.book.create({ data: { ...createBookDto, userId } });
  }

  async remove(id: string, currentUser: PublicUser): Promise<void> {
    const book = await this.findOne(id);

    if (currentUser.role !== Role.ADMIN && book.userId !== currentUser.id) {
      throw new ForbiddenException('You can only delete your own books');
    }

    await this.prismaService.book.delete({ where: { id } });
  }
}

