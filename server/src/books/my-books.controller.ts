import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { Book } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PublicUser } from '../users/public-user-select';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('me/books')
export class MyBooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@CurrentUser() currentUser: PublicUser): Promise<Book[]> {
    return this.booksService.findAllByOwner(currentUser.id);
  }

  @Post()
  create(
    @CurrentUser() currentUser: PublicUser,
    @Body() createBookDto: CreateBookDto,
  ): Promise<Book> {
    return this.booksService.create(currentUser.id, createBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @CurrentUser() currentUser: PublicUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.booksService.remove(id, currentUser);
  }
}

