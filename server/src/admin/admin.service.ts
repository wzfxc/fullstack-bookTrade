import { Injectable } from '@nestjs/common';
import { BooksService } from '../books/books.service';
import { PublicUser } from '../users/public-user-select';
import { UsersService } from '../users/users.service';
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

  deleteBook(bookId: string, admin: PublicUser): Promise<void> {
    return this.booksService.remove(bookId, admin);
  }
}

