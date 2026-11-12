import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { BooksService } from '../books/books.service';
import { PublicUser } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
import { CreateBookByAdminDto } from './dto/create-book-by-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  listUsers(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  createUser(createUserDto: CreateUserDto): Promise<PublicUser> {
    return this.usersService.create({
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
    });
  }

  async createBookForUser(
    userId: string,
    createBookByAdminDto: CreateBookByAdminDto,
  ): Promise<Book> {
    const targetUser = await this.usersService.findPublicById(userId);

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    return this.booksService.create(userId, createBookByAdminDto);
  }

  deleteBook(bookId: string, admin: PublicUser): Promise<void> {
    return this.booksService.remove(bookId, admin);
  }
}
